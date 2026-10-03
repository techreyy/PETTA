export interface DatabaseConfig {
  connectionString: string;
  isLocal: boolean;
  ssl: boolean | undefined;
}

/**
 * Sanitizes and normalizes a PostgreSQL connection string:
 * 1. Trims surrounding whitespace and quotes.
 * 2. Rewrites 'sslmode=require' to 'sslmode=verify-full' to prevent pg-connection-string
 *    deprecation security warnings while enforcing full TLS verification (CA + hostname).
 * 3. Enforces 'sslmode=verify-full' on remote hosts (Neon, etc.) if no SSL parameter is set.
 * 4. Preserves unencrypted connections for local loopback (localhost, 127.0.0.1, ::1).
 */
export function sanitizeDatabaseUri(rawUri?: string): string {
  if (!rawUri) return '';
  const trimmed = rawUri.trim().replace(/^["']|["']$/g, '');
  if (!trimmed) return '';

  try {
    const url = new URL(trimmed);
    const sslmode = url.searchParams.get('sslmode');

    // In pg / pg-connection-string, 'require' triggers:
    // "SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'..."
    // Explicitly setting 'verify-full' provides strict TLS verification without downgrading and without warnings.
    if (sslmode === 'require') {
      url.searchParams.set('sslmode', 'verify-full');
    }

    const isLocal =
      url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1' ||
      url.hostname === '::1';

    if (!isLocal && !url.searchParams.has('sslmode') && !url.searchParams.has('ssl')) {
      url.searchParams.set('sslmode', 'verify-full');
    }

    return url.toString();
  } catch {
    return trimmed.replace(/([?&])sslmode=require(&|$)/, '$1sslmode=verify-full$2');
  }
}

export function getDatabaseConfig(rawUri: string | undefined = process.env.DATABASE_URI): DatabaseConfig {
  const connectionString = sanitizeDatabaseUri(rawUri);
  const isLocal =
    !connectionString ||
    connectionString.includes('localhost') ||
    connectionString.includes('127.0.0.1') ||
    connectionString.includes('::1');

  return {
    connectionString,
    isLocal,
    // When isLocal is true, disable SSL.
    // For remote hosts, 'sslmode=verify-full' in connectionString configures node-postgres
    // with full TLS verification (CA and hostname checking) without downgrading.
    ssl: isLocal ? false : undefined,
  };
}
