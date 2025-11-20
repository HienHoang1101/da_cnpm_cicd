import { sendEmail } from '../services/emailService.js';
import nodemailer from 'nodemailer';

// Mock nodemailer
jest.mock('nodemailer');

describe('emailService - sendEmail', () => {
  let mockTransporter;

  beforeEach(() => {
    mockTransporter = {
      sendMail: jest.fn(),
    };
    nodemailer.createTransport.mockReturnValue(mockTransporter);
    jest.clearAllMocks();
  });

  test('should send email successfully and return info', async () => {
    const mockInfo = { messageId: 'msg123', accepted: ['test@example.com'] };
    mockTransporter.sendMail.mockResolvedValue(mockInfo);

    const result = await sendEmail(
      'test@example.com',
      'Test Subject',
      'Test plain text',
      '<p>Test HTML</p>'
    );

    expect(mockTransporter.sendMail).toHaveBeenCalledWith(
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
    mockTransporter.sendMail.mockRejectedValue(new Error('SMTP connection failed'));

    await expect(
      sendEmail('fail@example.com', 'Subject', 'Body')
    ).rejects.toThrow('Email failed: SMTP connection failed');
  });
});
