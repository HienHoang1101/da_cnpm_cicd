# TEST_CASES.md

This file lists recommended test cases for the FastFood Delivery project.  It covers unit tests, integration tests and suggested E2E flows per service.

Format: Service - [Unit / Integration / E2E] - Test case description

---

## payment-service
- Unit: `initiatePayment` - should create payment intent and payment record (happy path).
- Unit: `initiatePayment` - invalid orderId -> 404.
- Unit: `initiatePayment` - order already paid -> 400.
- Unit: `createCodPayment` - create COD payment record and update order status.
- Unit: `handleWebhook` - valid webhook event -> update payment status to PAID.
- Unit: `handleWebhook` - invalid signature -> returns 400.
- Integration: full flow with mocked order-service and Stripe stub.

## auth
- Unit: `register` - success -> returns user and token.
- Unit: `register` - duplicate email -> 409.
- Unit: `login` - success -> returns access token and profile.
- Unit: `login` - wrong password -> 401.
- Integration: registration -> login -> access protected route.

## order
- Unit: `createOrder` - invalid items -> 400.
- Unit: `createOrder` - success -> order persisted and items reserved.
- Integration: create order -> call payment -> payment success -> order status transitions.

## notification-service
- Unit: `sendEmail` - success -> provider mock received request.
- Unit: `sendSMS` - provider failure -> retry logic triggered.

## shared suggestions
- Add tests for metrics endpoints: `/metrics` returns Prometheus-formatted text and registers expected metrics.
- Use `mongodb-memory-server` or testcontainers for integration tests that require MongoDB.
- For services that call external APIs (Stripe, Firebase), use `nock` or `msw` to mock network calls.

## E2E scenarios (high level)
- Place an order (client) -> create order -> payment success -> notification sent -> driver assigned.
- Fail card payment -> fallback to COD and notify cancellation flow.

---

If you want, I can expand each item into a test file skeleton (Jest + Supertest) for a chosen service. Tell me which service to start with.
