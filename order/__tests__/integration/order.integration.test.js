import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app.js';
import CartItem from '../../model/cartItem.js';
import axios from 'axios';
import { Types } from 'mongoose';

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGO_URI = uri;
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

describe('Order flows (integration)', () => {
  test('Create order flow with mocked auth and restaurant services', async () => {
    // prepare fake ids
    const customerId = new Types.ObjectId();
    const restaurantId = new Types.ObjectId();
    const itemId = new Types.ObjectId();

    // seed cart item
    await CartItem.create({
      customerId,
      restaurantId,
      itemId,
      quantity: 1,
      itemPrice: 9.99,
      isPortionItem: false
    });

    // mock axios.get to return user and restaurant info conditionally
    const originalGet = axios.get;
    axios.get = (url, opts) => {
      if (url.includes('/api/auth/validate-token')) {
        return Promise.resolve({ data: { user: { id: customerId.toString(), name: 'ITest', email: 'i@test.com', phone: '+1000000000', role: 'customer', status: 'active' } } });
      }
      if (url.includes('/api/restaurants/')) {
        if (url.endsWith('/dishes')) {
          return Promise.resolve({ data: { dishes: [{ _id: itemId, name: 'Burger', price: 9.99, imageUrls: [] }] } });
        }
        return Promise.resolve({ data: { _id: restaurantId, name: 'R1', ownerId: new Types.ObjectId(), address: { coordinates: { lat: 0, lng: 0 } }, imageUrls: [], coverImageUrl: '', deliveryFee: 2.5 } });
      }
      return Promise.resolve({ data: {} });
    };

    // call create order with Authorization header
    const res = await request(app)
      .post('/api/orders/')
      .set('Authorization', 'Bearer faketoken')
      .send({ deliveryAddress: { line1: '123 Test St', coordinates: { lat: 0, lng: 0 } }, paymentMethod: 'COD' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('order');
    expect(res.body.order).toHaveProperty('orderId');
    expect(res.body.order.totalAmount).toBeGreaterThan(0);
    // restore axios.get
    axios.get = originalGet;
  });
});
