import { setTimeout as delay } from 'node:timers/promises';

export async function startLocalSession({
  probe,
  startDatabase,
  startDev,
  pause = () => delay(250),
  timeoutMs = 30000,
}) {
  let database;
  let dev;
  let stopping;
  const stop = () =>
    (stopping ??= (async () => {
      try {
        await dev?.stop();
      } finally {
        await database?.stop();
      }
    })());

  const initial = await probe();
  if (initial === 'busy') {
    throw new Error(
      'Local database port is occupied but the configured database is not ready. Check your local configuration; no processes were stopped.',
    );
  }

  if (initial !== 'ready') {
    database = await startDatabase();
    const startTime = Date.now();
    try {
      while (true) {
        if (Date.now() - startTime >= timeoutMs) {
          throw new Error('Database readiness check timed out.');
        }
        const state = await probe();
        if (state === 'ready') break;
        if (Date.now() - startTime >= timeoutMs) {
          throw new Error('Database readiness check timed out.');
        }
        await pause();
      }
    } catch (err) {
      await stop();
      throw err;
    }
  }

  try {
    dev = await startDev();
  } catch (err) {
    await stop();
    throw err;
  }

  return { stop };
}
