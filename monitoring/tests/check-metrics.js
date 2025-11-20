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
  const results = [];
  for (const s of SERVICES) {
    const r = await retryCheck(s.url, 15, 2000);
    results.push(Object.assign({ name: s.name }, r));
    if (r.ok) {
      console.log(`OK: ${s.name} (${s.url}) status=${r.statusCode}`);
    } else {
      failed++;
      console.error(`FAIL: ${s.name} (${s.url})`, r.error || `status=${r.statusCode}`);
    }
  }
    // Write artifacts (JSON + JUnit XML) for CI consumption
    try {
      const fs = require('fs');
      const path = require('path');
      const artifactsDir = path.join(__dirname, '..', '..', 'artifacts');
      if (!fs.existsSync(artifactsDir)) fs.mkdirSync(artifactsDir, { recursive: true });
      // JSON result
      fs.writeFileSync(path.join(artifactsDir, 'smoke-result.json'), JSON.stringify({ results }, null, 2));
      // JUnit XML
      const failures = results.filter((r) => !r.ok).length;
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += `<testsuites tests="${results.length}" failures="${failures}">\n`;
      xml += `  <testsuite name="monitoring-smoke" tests="${results.length}" failures="${failures}">\n`;
      for (const res of results) {
        const name = res.name || res.url;
        xml += `    <testcase classname="monitoring" name="${name}">\n`;
        if (!res.ok) {
          const msg = res.error || `status=${res.statusCode}`;
          xml += `      <failure message="${escapeXml(msg)}"><![CDATA[${msg}]]></failure>\n`;
        }
        xml += `    </testcase>\n`;
      }
      xml += '  </testsuite>\n';
      xml += '</testsuites>\n';
      fs.writeFileSync(path.join(artifactsDir, 'smoke-result.xml'), xml);
    } catch (err) {
      console.error('Failed to write artifacts:', err);
    }

    process.exit(failed === 0 ? 0 : 2);
})();

  function escapeXml(unsafe) {
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
