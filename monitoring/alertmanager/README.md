# Alertmanager Configuration

This directory contains Alertmanager configuration for the FastFood Delivery System monitoring.

## Overview

Alertmanager handles alerts sent by Prometheus server and routes them to the correct receiver (email, Slack, PagerDuty, etc.).

## Configuration

- `alertmanager.yml` — main configuration file defining:
  - **Routes**: how alerts are grouped and where they go
  - **Receivers**: notification endpoints (email, webhook, Slack, etc.)
  - **Inhibit rules**: prevent duplicate notifications

## Setup

1. **Configure receivers**: Edit `alertmanager.yml` and replace placeholders:
   - `https://hooks.example.com/monitoring` → your Slack/webhook URL
   - Email SMTP settings (host, username, password)

2. **Deploy Alertmanager**:
   ```bash
   kubectl apply -f kubernetes/monitoring/alertmanager.yaml
   ```

3. **Configure Prometheus** to send alerts to Alertmanager:
   ```yaml
   alerting:
     alertmanagers:
       - static_configs:
           - targets: ['alertmanager:9093']
   ```

## Routing Logic

- **Critical alerts** (severity=critical) → pager/email
- **Warning alerts** → team-notifications webhook
- Inhibit rules prevent warning alerts when critical alerts are firing for the same service

## Testing

Send a test alert:
```bash
curl -X POST http://alertmanager:9093/api/v1/alerts \
  -H 'Content-Type: application/json' \
  -d '[{"labels":{"alertname":"TestAlert","severity":"warning"},"annotations":{"summary":"Test alert"}}]'
```

## References

- [Alertmanager docs](https://prometheus.io/docs/alerting/latest/alertmanager/)
- [Configuration reference](https://prometheus.io/docs/alerting/latest/configuration/)
