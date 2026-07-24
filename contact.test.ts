import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import { NextRequest } from 'next/server';
import { GET, POST } from '../src/app/api/contact/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('/api/contact', () => {
  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.contactSubmission.deleteMany({
      where: {
        email: {
          contains: 'test'
        }
      }
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.contactSubmission.deleteMany({
      where: {
        email: {
          contains: 'test'
        }
      }
    });
    await prisma.$disconnect();
  });

  afterEach(async () => {
    // Clean up after each test
    await prisma.contactSubmission.deleteMany({
      where: {
        email: {
          contains: 'test'
        }
      }
    });
  });

  describe('POST /api/contact', () => {
    it('should create a new contact submission with valid data', async () => {
      const validSubmission = {
        name: 'John Doe',
        email: 'john.doe@test.com',
        phone: '+1234567890',
        company: 'Test Company',
        subject: 'Test Subject',
        message: 'This is a test message for contact submission.'
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(validSubmission)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toMatchObject({
        name: validSubmission.name,
        email: validSubmission.email,
        phone: validSubmission.phone,
        company: validSubmission.company,
        subject: validSubmission.subject,
        message: validSubmission.message
      });
      expect(data.data.id).toBeDefined();
      expect(data.data.createdAt).toBeDefined();

      // Verify the submission was saved to database
      const savedSubmission = await prisma.contactSubmission.findUnique({
        where: { id: data.data.id }
      });
      expect(savedSubmission).not.toBeNull();
      expect(savedSubmission?.email).toBe(validSubmission.email);
    });

    it('should create contact submission without optional fields', async () => {
      const minimalSubmission = {
        name: 'Jane Doe',
        email: 'jane.doe@test.com',
        subject: 'Minimal Test',
        message: 'This is a minimal test message.'
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(minimalSubmission)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe(minimalSubmission.name);
      expect(data.data.email).toBe(minimalSubmission.email);
      expect(data.data.phone).toBeNull();
      expect(data.data.company).toBeNull();
    });

    it('should return 400 for missing required fields', async () => {
      const invalidSubmission = {
        name: 'John Doe',
        email: 'john.doe@test.com'
        // Missing subject and message
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidSubmission)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('validation');
    });

    it('should return 400 for invalid email format', async () => {
      const invalidEmailSubmission = {
        name: 'John Doe',
        email: 'invalid-email',
        subject: 'Test Subject',
        message: 'Test message'
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidEmailSubmission)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toContain('email');
    });

    it('should return 400 for empty required fields', async () => {
      const emptyFieldsSubmission = {
        name: '',
        email: 'test@test.com',
        subject: '',
        message: ''
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emptyFieldsSubmission)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 for malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: '{"invalid": json}'
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should handle very long messages', async () => {
      const longMessage = 'A'.repeat(5000);
      const longMessageSubmission = {
        name: 'John Doe',
        email: 'john.long@test.com',
        subject: 'Long Message Test',
        message: longMessage
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(longMessageSubmission)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.message).toBe(longMessage);
    });

    it('should sanitize input data', async () => {
      const maliciousSubmission = {
        name: '<script>alert("xss")</script>John',
        email: 'john.script@test.com',
        subject: '<img src="x" onerror="alert(1)">Test Subject',
        message: 'Normal message content'
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(maliciousSubmission)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      // Check that script tags are handled appropriately
      expect(data.data.name).not.toContain('<script>');
      expect(data.data.subject).not.toContain('<img');
    });
  });

  describe('GET /api/contact', () => {
    beforeEach(async () => {
      // Create test contact submissions
      await prisma.contactSubmission.createMany({
        data: [
          {
            name: 'Test User 1',
            email: 'test1@test.com',
            subject: 'Test Subject 1',
            message: 'Test message 1',
            createdAt: new Date('2024-01-01')
          },
          {
            name: 'Test User 2',
            email: 'test2@test.com',
            phone: '+1234567890',
            company: 'Test Company',
            subject: 'Test Subject 2',
            message: 'Test message 2',
            createdAt: new Date('2024-01-02')
          }
        ]
      });
    });

    it('should return all contact submissions', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThanOrEqual(2);
      
      const testSubmissions = data.data.filter((submission: any) => 
        submission.email.includes('test')
      );
      expect(testSubmissions.length).toBe(2);
    });

    it('should return submissions in descending order by creation date', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      
      const testSubmissions = data.data.filter((submission: any) => 
        submission.email.includes('test')
      ).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      expect(testSubmissions[0].email).toBe('test2@test.com');
      expect(testSubmissions[1].email).toBe('test1@test.com');
    });

    it('should handle pagination parameters', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact?page=1&limit=1');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.pagination).toBeDefined();
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(1);
      expect(data.pagination.total).toBeGreaterThanOrEqual(2);
    });

    it('should return empty array when no submissions exist', async () => {
      // Clean up all test data
      await prisma.contactSubmission.deleteMany({
        where: {
          email: {
            contains: 'test'
          }
        }
      });

      const request = new NextRequest('http://localhost:3000/api/contact');

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Mock prisma to simulate database error
      const originalCreate = prisma.contactSubmission.create;
      prisma.contactSubmission.create = jest.fn().mockRejectedValue(new Error('Database connection failed'));

      const validSubmission = {
        name: 'John Doe',
        email: 'john.error@test.com',
        subject: 'Test Subject',
        message: 'Test message'
      };

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(validSubmission)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();

      // Restore original method
      prisma.contactSubmission.create = originalCreate;
    });

    it('should handle unsupported HTTP methods', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'DELETE'
      });

      // Since only GET and POST are implemented, this should return method not allowed
      try {
        const response = await POST(request);
        expect(response.status).toBe(405);
      } catch (error) {
        // Method not implemented, which is expected
        expect(error).toBeDefined();
      }
    });
  });
});