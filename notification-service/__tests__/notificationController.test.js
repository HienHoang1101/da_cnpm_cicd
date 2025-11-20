import { createNotification, getNotifications, markAsRead } from '../controllers/notificationController.js';
import Notification from '../models/Notification.js';

// Mock Notification model
jest.mock('../models/Notification.js');

describe('notificationController - createNotification', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        type: 'order_update',
        recipientType: 'user',
        recipientId: 'user123',
        relatedEntity: { entityType: 'order', entityId: 'order123' },
        title: 'Order Confirmed',
        message: 'Your order has been confirmed',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test('should create notification successfully', async () => {
    const mockNotification = {
      _id: 'notif123',
      ...req.body,
      save: jest.fn().mockResolvedValue(true),
    };
    Notification.mockImplementation(() => mockNotification);

    await createNotification(req, res);

    expect(mockNotification.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        notification: expect.objectContaining({ _id: 'notif123' }),
      })
    );
  });

  test('should return 400 if required fields missing', async () => {
    req.body = {}; // Missing all required fields

    await createNotification(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.stringContaining('Missing required fields'),
      })
    );
  });
});

describe('notificationController - getNotifications', () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test('should fetch all notifications', async () => {
    const mockNotifications = [
      { _id: '1', type: 'order_update', status: 'unread' },
      { _id: '2', type: 'promo', status: 'read' },
    ];
    Notification.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockNotifications),
      }),
    });

    await getNotifications(req, res);

    expect(Notification.find).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: mockNotifications,
      })
    );
  });
});

describe('notificationController - markAsRead', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: 'notif123' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test('should mark notification as read', async () => {
    const mockNotification = {
      _id: 'notif123',
      status: 'unread',
      save: jest.fn().mockResolvedValue(true),
    };
    Notification.findById = jest.fn().mockResolvedValue(mockNotification);

    await markAsRead(req, res);

    expect(mockNotification.status).toBe('read');
    expect(mockNotification.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: mockNotification,
      })
    );
  });

  test('should return 404 if notification not found', async () => {
    Notification.findById = jest.fn().mockResolvedValue(null);

    await markAsRead(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Notification not found',
      })
    );
  });
});
