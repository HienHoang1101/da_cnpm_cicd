const http = require('http');

// Default host ports should match docker-compose host mappings used during monitoring runs.
// They can be overridden with environment variables PAYMENT_METRICS_URL, AUTH_METRICS_URL, ORDER_METRICS_URL
const SERVICES = [
  { name: 'payment-service', url: process.env.PAYMENT_METRICS_URL || 'http://localhost:5005/metrics' },
  { name: 'auth-service', url: process.env.AUTH_METRICS_URL || 'http://localhost:5001/metrics' },
  { name: 'order-service', url: process.env.ORDER_METRICS_URL || 'http://localhost:5002/metrics' },
];

function check(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        const ok = /service_http_requests_total/.test(body) || /process_cpu_user_seconds_total/.test(body);
        resolve({ url, ok, statusCode: res.statusCode });
      });
    });
    req.on('error', (err) => resolve({ url, ok: false, error: String(err) }));
    req.setTimeout(5000, () => {
      req.abort();
      resolve({ url, ok: false, error: 'timeout' });
    });
  });
}

async function retryCheck(url, attempts = 15, delayMs = 2000) {
  for (let i = 1; i <= attempts; i++) {
    const r = await check(url);
    if (r.ok) return r;
    if (i < attempts) {
      process.stdout.write(`waiting for ${url} (attempt ${i}/${attempts})... `);
      await new Promise((res) => setTimeout(res, delayMs));
      process.stdout.write('retrying\n');
    } else {
      return r; // final attempt result (not ok)
    }
  }
}

(async () => {
  console.log('Checking service /metrics endpoints (localhost) with retries)');
  let failed = 0;
  for (const s of SERVICES) {
    const r = await retryCheck(s.url, 15, 2000);
    if (r.ok) {
      console.log(`OK: ${s.name} (${s.url}) status=${r.statusCode}`);
    } else {
      failed++;
      console.error(`FAIL: ${s.name} (${s.url})`, r.error || `status=${r.statusCode}`);
    }
  }
  process.exit(failed === 0 ? 0 : 2);
})();
