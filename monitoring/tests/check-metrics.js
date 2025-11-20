const http = require('http');
const SERVICES = [
  { name: 'payment-service', url: 'http://localhost:5004/metrics' },
  { name: 'auth-service', url: 'http://localhost:5000/metrics' },
  { name: 'order-service', url: 'http://localhost:5001/metrics' },
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

(async () => {
  console.log('Checking service /metrics endpoints (localhost)');
  let failed = 0;
  for (const s of SERVICES) {
    const r = await check(s.url);
    if (r.ok) {
      console.log(`OK: ${s.name} (${s.url}) status=${r.statusCode}`);
    } else {
      failed++;
      console.error(`FAIL: ${s.name} (${s.url})`, r.error || `status=${r.statusCode}`);
    }
  }
  process.exit(failed === 0 ? 0 : 2);
})();
