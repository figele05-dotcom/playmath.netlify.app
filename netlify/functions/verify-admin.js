exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: { 'Allow': 'POST' }, body: JSON.stringify({ ok: false, message: 'Method not allowed' }) };
  const expected = process.env.PLAYMATH_ADMIN_PASSWORD;
  if (!expected) return { statusCode: 503, body: JSON.stringify({ ok: false, message: 'Admin secret is not configured on the deployment.' }) };
  let submitted = '';
  try { submitted = JSON.parse(event.body || '{}').password || ''; } catch (error) { return { statusCode: 400, body: JSON.stringify({ ok: false, message: 'Invalid request.' }) }; }
  const crypto = require('crypto');
  const a = Buffer.from(String(submitted));
  const b = Buffer.from(String(expected));
  const valid = a.length === b.length && crypto.timingSafeEqual(a, b);
  return { statusCode: valid ? 200 : 401, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(valid ? { ok: true } : { ok: false, message: 'Incorrect password.' }) };
};