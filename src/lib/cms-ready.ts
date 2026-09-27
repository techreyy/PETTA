export function cmsReady() {
  return Boolean(process.env.DATABASE_URI && process.env.PAYLOAD_SECRET && process.env.PAYLOAD_SECRET.length >= 32);
}
