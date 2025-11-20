import { jest } from '@jest/globals';

// ESM-compatible testing: mock the Notification module before importing controller
let createNotification, getNotifications, markAsRead;
let NotificationMock;

beforeAll(async () => {
  // Create mock implementations we can reference in tests
  const mockConstructor = jest.fn();
  // Attach static methods onto the default export (Mongoose model shape)
  mockConstructor.find = jest.fn();
  mockConstructor.findById = jest.fn();

  NotificationMock = {
    default: mockConstructor,
  };

  await jest.unstable_mockModule('../models/Notification.js', () => NotificationMock);

  const controllerModule = await import('../controllers/notificationController.js');
  createNotification = controllerModule.createNotification;
  getNotifications = controllerModule.getNotifications;
  markAsRead = controllerModule.markAsRead;

  // Import the mocked model so tests can access and configure its mocks
  const notifModule = await import('../models/Notification.js');
  // In ESM mock, default export is the mockConstructor with attached static methods
  global.NotificationModel = notifModule.default;
});

beforeEach(() => {
  jest.clearAllMocks();
});

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
  });

  test('should create notification successfully', async () => {
    const mockNotification = {
      _id: 'notif123',
      ...req.body,
      save: jest.fn().mockResolvedValue({ _id: 'notif123', ...req.body }),
    };
    // Make constructor return the mock
    global.NotificationModel.mockImplementation(() => mockNotification);

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
  });

  test('should fetch all notifications', async () => {
    const mockNotifications = [
      { _id: '1', type: 'order_update', status: 'unread' },
      { _id: '2', type: 'promo', status: 'read' },
    ];
    global.NotificationModel.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockNotifications),
      }),
    });

    await getNotifications(req, res);

    expect(global.NotificationModel.find).toHaveBeenCalledWith({});
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
  });

  test('should mark notification as read', async () => {
    const mockNotification = {
      _id: 'notif123',
      status: 'unread',
      save: jest.fn().mockResolvedValue(true),
    };
    global.NotificationModel.findById.mockResolvedValue(mockNotification);

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
    global.NotificationModel.findById.mockResolvedValue(null);

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
