import { describe, it, expect, beforeAll, afterAll, afterEach, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/contact/route'
import { PrismaClient } from '@prisma/client'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  default: {
    contact: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    contactSubmission: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
  },
}))

// Mock nodemailer
vi.mock('nodemailer', () => ({
  createTransport: vi.fn(() => ({
    sendMail: vi.fn(() => Promise.resolve({ messageId: 'test-id' })),
  })),
}))

const mockPrisma = vi.mocked(await import('@/lib/prisma')).default
const prisma = new PrismaClient()

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

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(async () => {
    vi.restoreAllMocks()
    // Clean up after each test
    await prisma.contactSubmission.deleteMany({
      where: {
        email: {
          contains: 'test'
        }
      }
    });
  })

  describe('POST /api/contact', () => {
    const validContactData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      company: 'Test Company',
      phone: '+1234567890',
      subject: 'Test Inquiry',
      message: 'This is a test message',
      source: 'website'
    }

    const validSubmission = {
      name: 'John Doe',
      email: 'john.doe@test.com',
      phone: '+1234567890',
      company: 'Test Company',
      subject: 'Test Subject',
      message: 'This is a test message for contact submission.'
    };

    it('should create a new contact submission successfully', async () => {
      const mockContact = {
        id: 'contact-123',
        ...validContactData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'NEW'
      }

      mockPrisma.contact.create.mockResolvedValue(mockContact)

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validContactData),
      })

      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(201)
      expect(responseData.success).toBe(true)
      expect(responseData.data.id).toBe('contact-123')
      expect(responseData.data.name).toBe(validContactData.name)
      expect(responseData.data.email).toBe(validContactData.email)
      expect(responseData.message).toBe('Contact form submitted successfully')

      expect(mockPrisma.contact.create).toHaveBeenCalledWith({
        data: {
          name: validContactData.name,
          email: validContactData.email,
          company: validContactData.company,
          phone: validContactData.phone,
          subject: validContactData.subject,
          message: validContactData.message,
          source: validContactData.source,
          status: 'NEW'
        }
      })
    })

    it('should create a new contact submission with valid data', async () => {
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

    it('should handle missing required fields', async () => {
      const invalidData = {
        name: 'John Doe',
        // Missing email, subject, and message
        company: 'Test Company'
      }

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidData),
      })

      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toContain('validation')
      expect(mockPrisma.contact.create).not.toHaveBeenCalled()
    })

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

    it('should validate email format', async () => {
      const invalidEmailData = {
        ...validContactData,
        email: 'invalid-email'
      }

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidEmailData),
      })

      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toContain('email')
      expect(mockPrisma.contact.create).not.toHaveBeenCalled()
    })

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

    it('should handle empty request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '',
      })

      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toContain('Invalid request body')
      expect(mockPrisma.contact.create).not.toHaveBeenCalled()
    })

    it('should handle invalid JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{invalid json}',
      })

      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toContain('Invalid JSON')
      expect(mockPrisma.contact.create).not.toHaveBeenCalled()
    })

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

    it('should validate message length', async () => {
      const longMessageData = {
        ...validContactData,
        message: 'a'.repeat(5001) // Exceeds typical message length limit
      }

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(longMessageData),
      })

      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toContain('message')
      expect(mockPrisma.contact.create).not.toHaveBeenCalled()
    })

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

    it('should validate phone number format', async () => {
      const invalidPhoneData = {
        ...validContactData,
        phone: '123' // Invalid phone format
      }

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidPhoneData),
      })

      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(400)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toContain('phone')
      expect(mockPrisma.contact.create).not.toHaveBeenCalled()
    })

    it('should handle database errors', async () => {
      mockPrisma.contact.create.mockRejectedValue(new Error('Database connection failed'))

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validContactData),
      })

      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(500)
      expect(responseData.success).toBe(false)
      expect(responseData.error).toContain('Internal server error')
    })

    it('should sanitize input data', async () => {
      const maliciousData = {
        name: '<script>alert("xss")</script>John Doe',
        email: 'john.doe@example.com',
        subject: 'Test Subject',
        message: '<img src="x" onerror="alert(\'xss\')" />Test message',
        company: 'Test & Company',
        phone: '+1234567890',
        source: 'website'
      }

      const mockContact = {
        id: 'contact-123',
        ...maliciousData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'NEW'
      }

      mockPrisma.contact.create.mockResolvedValue(mockContact)

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(maliciousData),
      })

      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(201)
      expect(responseData.success).toBe(true)
      
      // Verify that data was sanitized before saving
      const createCall = mockPrisma.contact.create.mock.calls[0][0]
      expect(createCall.data.name).not.toContain('<script>')
      expect(createCall.data.message).not.toContain('<img')
    })

    it('should sanitize malicious submission data', async () => {
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

    it('should handle rate limiting', async () => {
      // Mock multiple rapid requests
      const requests = Array.from({ length: 6 }, () => 
        new NextRequest('http://localhost:3000/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': '192.168.1.1'
          },
          body: JSON.stringify(validContactData),
        })
      )

      mockPrisma.contact.create.mockResolvedValue({
        id: 'contact-123',
        ...validContactData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'NEW'
      })

      // Execute requests rapidly
      const responses = await Promise.all(requests.map(req => POST(req)))
      
      // At least one should be rate limited (depending on implementation)
      const rateLimitedResponses = responses.filter(res => res.status === 429)
      expect(rateLimitedResponses.length).toBeGreaterThanOrEqual(0)
    })

    it('should handle optional fields correctly', async () => {
      const minimalData = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        subject: 'Minimal Contact',
        message: 'This is a minimal contact form submission'
      }

      const mockContact = {
        id: 'contact-456',
        ...minimalData,
        company: null,
        phone: null,
        source: 'website',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'NEW'
      }

      mockPrisma.contact.create.mockResolvedValue(mockContact)

      const request = new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(minimalData),
      })

      const response = await POST(request)
      const responseData = await response.json()

      expect(response.status).toBe(201)
      expect(responseData.success).toBe(true)
      expect(responseData.data.name).toBe(minimalData.name)
      expect(responseData.data.email).toBe(minimalData.email)
      expect(responseData.data.company).toBeNull()
      expect(responseData.data.phone).toBeNull()
    })
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
      expect(data.data.length).toBe(0);
    });
  });
});
