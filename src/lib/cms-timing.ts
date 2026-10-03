import type { Payload } from 'payload';

/** Opt-in Local API timings; never log arguments, records, users or SQL parameters. */
export function withCMSTiming(payload: Payload): Payload {
  if (process.env.NODE_ENV === 'production' || process.env.PETTA_CMS_TIMING !== 'true') return payload;
  return new Proxy(payload, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver);
      if (property !== 'find' && property !== 'findGlobal') return value;
      return async (options: { collection?: string; slug?: string; limit?: number }) => {
        const start = performance.now();
        try {
          return await value.call(target, options);
        } finally {
          const label = options.collection || options.slug;
          console.info(`[cms-timing] ${property}:${label}:${options.limit === 1 ? 'detail' : 'list'} ${(performance.now() - start).toFixed(1)}ms`);
        }
      };
    },
  });
}
