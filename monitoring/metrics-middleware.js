import client from 'prom-client';

// Default metrics collector
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const httpRequestCounter = new client.Counter({
  name: 'service_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['service', 'method', 'route', 'status_code'],
});

const httpRequestDuration = new client.Histogram({
  name: 'service_http_request_duration_seconds',
  help: 'Histogram of request durations',
  labelNames: ['service', 'route', 'method'],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5]
});

export function metricsMiddleware(serviceName) {
  return (req, res, next) => {
    const end = httpRequestDuration.startTimer({ service: serviceName, route: req.route?.path || req.path, method: req.method });
    res.on('finish', () => {
      httpRequestCounter.inc({ service: serviceName, method: req.method, route: req.route?.path || req.path, status_code: res.statusCode }, 1);
      end();
    });
    next();
  };
}

export default client;
