export interface S3NormalizedConfig {
  bucket: string;
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  forcePathStyle: boolean;
}

/**
 * Normalizes and validates Cloudflare R2 / S3 configuration:
 * 1. Trims whitespace and strips accidental enclosing quotes.
 * 2. Ensures endpoint has protocol (https://) to avoid AWS SDK ERR_INVALID_URL.
 * 3. Strips trailing slashes from endpoint.
 * 4. Strips redundant /${bucket} suffix from endpoint (forcePathStyle handles the path).
 * 5. Enforces S3_REGION='auto' as required by Cloudflare R2.
 * 6. Enforces forcePathStyle=true as required by Cloudflare R2 (virtual host routing is unsupported).
 */
export function normalizeS3Config(env: Record<string, string | undefined> = process.env): S3NormalizedConfig {
  const bucket = (env.S3_BUCKET || '').trim().replace(/^["']|["']$/g, '');
  let rawEndpoint = (env.S3_ENDPOINT || '').trim().replace(/^["']|["']$/g, '');

  if (rawEndpoint) {
    if (!rawEndpoint.startsWith('http://') && !rawEndpoint.startsWith('https://')) {
      rawEndpoint = `https://${rawEndpoint}`;
    }
    rawEndpoint = rawEndpoint.replace(/\/+$/, '');
    if (bucket && rawEndpoint.endsWith(`/${bucket}`)) {
      rawEndpoint = rawEndpoint.slice(0, -(bucket.length + 1)).replace(/\/+$/, '');
    }
  }

  const region = (env.S3_REGION || 'auto').trim().replace(/^["']|["']$/g, '') || 'auto';
  const accessKeyId = (env.S3_ACCESS_KEY_ID || '').trim().replace(/^["']|["']$/g, '');
  const secretAccessKey = (env.S3_SECRET_ACCESS_KEY || '').trim().replace(/^["']|["']$/g, '');

  return {
    bucket,
    endpoint: rawEndpoint,
    region,
    accessKeyId,
    secretAccessKey,
    // Cloudflare R2 requires forcePathStyle: true because R2 does not support virtual-hosted style subdomains
    forcePathStyle: true,
  };
}

export function isS3Configured(config: S3NormalizedConfig = normalizeS3Config()): boolean {
  return Boolean(config.bucket);
}

export function getMissingS3Vars(config: S3NormalizedConfig = normalizeS3Config()): string[] {
  const missing: string[] = [];
  if (!config.bucket) missing.push('S3_BUCKET');
  if (!config.endpoint) missing.push('S3_ENDPOINT');
  if (!config.accessKeyId) missing.push('S3_ACCESS_KEY_ID');
  if (!config.secretAccessKey) missing.push('S3_SECRET_ACCESS_KEY');
  return missing;
}

export function maskCredential(str: string, visibleChars = 4): string {
  if (!str) return '<empty>';
  if (str.length <= visibleChars * 2) return '***';
  return `${str.slice(0, visibleChars)}...${str.slice(-visibleChars)}`;
}

export interface S3Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (data: unknown) => void;
}

/**
 * Creates an AWS SDK v3 logger that safely outputs actionable error details
 * (command, bucket, object key, error name, message, HTTP status) without ever
 * logging secret access keys, authorization tokens, or request bodies.
 */
export function createSafeS3Logger(): S3Logger {
  return {
    debug: () => {},
    info: (msg: unknown) => {
      if (typeof msg === 'string' && !msg.toLowerCase().includes('secret') && !msg.toLowerCase().includes('key')) {
        console.log('[S3 Storage Info]', msg);
      }
    },
    warn: (msg: unknown) => {
      const message = typeof msg === 'object' && msg !== null && 'message' in msg ? String((msg as { message: unknown }).message) : String(msg);
      console.warn('[S3 Storage Warn]', message);
    },
    error: (data: unknown) => {
      if (typeof data === 'object' && data !== null) {
        const d = data as Record<string, unknown>;
        const errObj = (typeof d.error === 'object' && d.error !== null ? d.error : d) as Record<string, unknown>;
        const inputObj = (typeof d.input === 'object' && d.input !== null ? d.input : errObj.input) as Record<string, unknown> | undefined;
        const metadata = (typeof errObj.$metadata === 'object' && errObj.$metadata !== null ? errObj.$metadata : {}) as Record<string, unknown>;

        const cmd = typeof d.commandName === 'string' ? d.commandName : (typeof errObj.commandName === 'string' ? errObj.commandName : 'UnknownCommand');
        const key = typeof inputObj?.Key === 'string' ? inputObj.Key : 'N/A';
        const bucket = typeof inputObj?.Bucket === 'string' ? inputObj.Bucket : 'N/A';
        const statusCode = metadata.httpStatusCode ?? errObj.statusCode ?? 'N/A';
        const requestId = typeof metadata.requestId === 'string' ? metadata.requestId : (typeof errObj.requestId === 'string' ? errObj.requestId : undefined);
        const errorName = typeof errObj.name === 'string' ? errObj.name : 'Error';
        const errorMessage = typeof errObj.message === 'string' ? errObj.message : 'Unknown error';

        console.error(
          `[S3/R2 Storage Error] Command=${cmd} Bucket=${bucket} Key=${key} Error=${errorName}: ${errorMessage} (HTTP ${String(statusCode)}${requestId ? `, RequestId=${requestId}` : ''})`
        );
      } else {
        console.error('[S3/R2 Storage Error]', String(data));
      }
    },
  };
}
