# Monitoring

This folder contains centralized monitoring configuration for the FastFood Delivery project.

Goals:
- Centralize Prometheus scrape configuration and alerting rules.
- Provide Grafana dashboards (provisioned) to visualize service metrics.
- Ensure PRs that change monitoring configuration are reviewed by owners listed in `CODEOWNERS`.

Guidelines:
- Keep scrape intervals conservative (15s) for production; tests and dev can use higher intervals.
- When adding metrics, prefer stable metric names and include `service` labels.
Monitoring skeleton for the FastFood Delivery project

Overview
- This folder contains example Prometheus + Grafana configs to get you started with monitoring the microservices in this repo.
- Purpose: provide a central place to store monitoring configuration that can be used in local development, Docker Compose, or Kubernetes.

Files
- `prometheus.yml` — Prometheus configuration with sample `scrape_configs` for `payment-service`, `auth-service`, and `order-service`. Adjust targets to match your environment (hostname:port).
- `alert_rules.yml` — Example alerting rules (instance down, high error rate, high latency).
- `grafana-dashboard-payment-service.json` — Minimal Grafana dashboard for the payment service. Import this JSON into Grafana (Dashboards → Manage → Import).

How to use locally
1. Start services you want to monitor (for example `payment-service` on port 5004).
2. Run Prometheus with this config (example):

   docker run --rm -p 9090:9090 \
     -v "${PWD}/prometheus.yml:/etc/prometheus/prometheus.yml" \
     prom/prometheus

3. Open `http://localhost:9090` and check `Targets` to see scraped services.
4. Import `grafana-dashboard-payment-service.json` into Grafana.

Notes for Kubernetes
- If deploying to Kubernetes, prefer Kubernetes service discovery — sample commented `kubernetes_sd_configs` included in `prometheus.yml`.
- Provision Grafana dashboards via configMaps or Grafana provisioning.

Extending to multiple repos / clusters
- Option A (single monitoring repo): keep a central `monitoring/` repo that contains Prometheus, Alertmanager, and Grafana provisioning. Each application repo only needs to expose `/metrics`.
- Option B (federation): run one Prometheus per cluster, and a central Prometheus that federates key metrics.

Next steps I can do for you
- Add a Helm/kubernetes manifest to deploy Prometheus & Grafana into `kubernetes/`.
- Create Grafana provisioning files to auto-import dashboards and datasources.
- Add exporter instrumentation examples to more services (e.g., `auth`, `order`).

Quick smoke tests
- There's a small smoke-check script at `monitoring/tests/check-metrics.js` that queries `/metrics` on common localhost ports. It is intended for local/dev checks or CI jobs that bring up services via `docker-compose`.

Governance additions
- A PR template and `CODEOWNERS` entries were added so monitoring changes require explicit reviewer attention.
