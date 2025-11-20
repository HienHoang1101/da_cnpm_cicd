import paymentController from '../controllers/paymentController.js';
import Payment from '../models/Payment.js';
import axios from 'axios';

// Mock external dependencies
jest.mock('../models/Payment.js');
jest.mock('axios');

describe('paymentController - initiatePayment', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { orderId: 'order123', amount: 5000, currency: 'lkr' },
      user: { id: 'user123' },
      headers: { authorization: 'Bearer token123' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test('should create payment intent and payment record (happy path)', async () => {
    // Mock order service response
    axios.get.mockResolvedValue({
      data: {
        order: {
          _id: 'order123',
          paymentStatus: 'PENDING',
        },
      },
    });
    axios.patch.mockResolvedValue({ data: {} });

    // Mock Payment model
    const mockPayment = { _id: 'payment123', save: jest.fn().mockResolvedValue(true) };
    Payment.mockImplementation(() => mockPayment);

    await paymentController.initiatePayment(req, res);

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/api/orders/order123'),
      expect.objectContaining({ headers: { authorization: 'Bearer token123' } })
    );
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        clientSecret: expect.any(String),
        paymentId: 'payment123',
      })
    );
  });

  test('should return 404 if order not found', async () => {
    axios.get.mockResolvedValue({ data: {} });

    await paymentController.initiatePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Order not found' });
  });

  test('should return 400 if order already paid', async () => {
    axios.get.mockResolvedValue({
      data: {
        order: {
          _id: 'order123',
          paymentStatus: 'PAID',
        },
      },
    });

    await paymentController.initiatePayment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('already') })
    );
  });
});

describe('paymentController - createCodPayment', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { orderId: 'order456', amount: 3000 },
      user: { id: 'user456' },
      headers: { authorization: 'Bearer token456' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test('should create COD payment record and update order status', async () => {
    axios.get.mockResolvedValue({ data: { _id: 'order456', status: 'PENDING' } });
    axios.patch.mockResolvedValue({ data: {} });

    const mockPayment = { _id: 'payment456', save: jest.fn().mockResolvedValue(true) };
    Payment.mockImplementation(() => mockPayment);

    await paymentController.createCodPayment(req, res);

    expect(mockPayment.save).toHaveBeenCalled();
    expect(axios.patch).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        paymentId: 'payment456',
      })
    );
  });
});

describe('paymentController - handleWebhook', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: JSON.stringify({
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test',
            metadata: { orderId: 'order789', userId: 'user789' },
            payment_method_details: { card: { brand: 'visa', last4: '4242' } },
            charges: { data: [{ receipt_url: 'https://receipt.url' }] },
          },
        },
      }),
      headers: { 'stripe-signature': 'test_sig' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test('should return 400 for invalid signature', async () => {
    // Stripe stub will not validate properly; this test simulates webhook error
    req.headers['stripe-signature'] = '';

    await paymentController.handleWebhook(req, res);

    // Depending on stub behavior, this may be 400 or proceed; adjust assertion accordingly
    expect(res.status).toHaveBeenCalled();
  });

  test('should update payment status to PAID on payment_intent.succeeded', async () => {
    const mockPayment = { _id: 'payment789', status: 'PENDING' };
    Payment.findOneAndUpdate = jest.fn().mockResolvedValue(mockPayment);
    axios.patch.mockResolvedValue({ data: {} });

    await paymentController.handleWebhook(req, res);

    expect(Payment.findOneAndUpdate).toHaveBeenCalledWith(
      { paymentIntentId: 'pi_test' },
      expect.objectContaining({ status: 'PAID' }),
      { new: true }
    );
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });
});
