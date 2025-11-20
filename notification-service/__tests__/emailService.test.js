import { jest } from '@jest/globals';

// ESM-compatible mocking for nodemailer
let sendEmail;
let createTransportMock;

beforeAll(async () => {
  // Prepare a shared mock transporter that the service will use at import time
  createTransportMock = jest.fn();
  const sharedTransporter = { sendMail: jest.fn() };
  createTransportMock.mockReturnValue(sharedTransporter);
  // nodemailer is imported as default; provide a default export object
  await jest.unstable_mockModule('nodemailer', () => ({ default: { createTransport: createTransportMock } }));
  const svc = await import('../services/emailService.js');
  sendEmail = svc.sendEmail;
  // expose the transporter for tests to manipulate
  global.__mockTransporter = sharedTransporter;
});

beforeEach(() => jest.clearAllMocks());

describe('emailService - sendEmail', () => {

  test('should send email successfully and return info', async () => {
    const mockInfo = { messageId: 'msg123', accepted: ['test@example.com'] };
    global.__mockTransporter.sendMail.mockResolvedValue(mockInfo);

    const result = await sendEmail('test@example.com', 'Test Subject', 'Test plain text', '<p>Test HTML</p>');

    expect(global.__mockTransporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test plain text',
        html: '<p>Test HTML</p>',
      })
    );
    expect(result).toEqual(mockInfo);
  });

  test('should throw error when email provider fails', async () => {
    global.__mockTransporter.sendMail.mockRejectedValue(new Error('SMTP connection failed'));

    await expect(sendEmail('fail@example.com', 'Subject', 'Body')).rejects.toThrow('Email failed: SMTP connection failed');
  });
});
