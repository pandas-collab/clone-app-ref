import { describe, expect, test, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { NextRequest } from 'next/server';
import { GET, POST, PUT, DELETE } from '../src/app/api/careers/route';
import { GET as getCareer, PUT as updateCareer, DELETE as deleteCareer } from '../src/app/api/careers/[id]/route';
import { GET as getApplications, POST as createApplication } from '../src/app/api/careers/[id]/applications/route';
import { prisma } from '../src/lib/prisma';
import { getServerSession } from 'next-auth';

// Mock NextAuth
jest.mock('next-auth');
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

// Mock Prisma
jest.mock('../src/lib/prisma', () => ({
  prisma: {
    career: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    application: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('/api/careers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/careers', () => {
    test('should return all careers', async () => {
      const mockCareers = [
        {
          id: '1',
          title: 'Software Engineer',
          description: 'Join our engineering team',
          requirements: 'Bachelor degree in CS',
          location: 'Remote',
          type: 'FULL_TIME',
          salary: '$80,000 - $120,000',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: '2',
          title: 'Product Manager',
          description: 'Lead product development',
          requirements: '5+ years experience',
          location: 'New York',
          type: 'FULL_TIME',
          salary: '$100,000 - $150,000',
          isActive: true,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ];

      mockPrisma.career.findMany.mockResolvedValue(mockCareers);

      const request = new NextRequest('http://localhost:3000/api/careers');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.careers).toEqual(mockCareers);
      expect(mockPrisma.career.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });
    });

    test('should handle database errors', async () => {
      mockPrisma.career.findMany.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/careers');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch careers');
    });
  });

  describe('POST /api/careers', () => {
    test('should create a new career when authenticated', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', email: 'admin@example.com', role: 'ADMIN' },
      } as any);

      const newCareer = {
        title: 'UX Designer',
        description: 'Design user experiences',
        requirements: 'Portfolio required',
        location: 'San Francisco',
        type: 'FULL_TIME',
        salary: '$90,000 - $130,000',
      };

      const createdCareer = {
        id: '3',
        ...newCareer,
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      mockPrisma.career.create.mockResolvedValue(createdCareer);

      const request = new NextRequest('http://localhost:3000/api/careers', {
        method: 'POST',
        body: JSON.stringify(newCareer),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.career).toEqual(createdCareer);
      expect(mockPrisma.career.create).toHaveBeenCalledWith({
        data: newCareer,
      });
    });

    test('should return 401 when not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/careers', {
        method: 'POST',
        body: JSON.stringify({ title: 'Test Job' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    test('should validate required fields', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', email: 'admin@example.com', role: 'ADMIN' },
      } as any);

      const request = new NextRequest('http://localhost:3000/api/careers', {
        method: 'POST',
        body: JSON.stringify({ title: '' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });
  });
});

describe('/api/careers/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/careers/[id]', () => {
    test('should return career by id', async () => {
      const mockCareer = {
        id: '1',
        title: 'Software Engineer',
        description: 'Join our engineering team',
        requirements: 'Bachelor degree in CS',
        location: 'Remote',
        type: 'FULL_TIME',
        salary: '$80,000 - $120,000',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      };

      mockPrisma.career.findUnique.mockResolvedValue(mockCareer);

      const request = new NextRequest('http://localhost:3000/api/careers/1');
      const response = await getCareer(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.career).toEqual(mockCareer);
      expect(mockPrisma.career.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    test('should return 404 for non-existent career', async () => {
      mockPrisma.career.findUnique.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/careers/999');
      const response = await getCareer(request, { params: { id: '999' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Career not found');
    });
  });

  describe('PUT /api/careers/[id]', () => {
    test('should update career when authenticated', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', email: 'admin@example.com', role: 'ADMIN' },
      } as any);

      const updateData = {
        title: 'Senior Software Engineer',
        salary: '$100,000 - $140,000',
      };

      const updatedCareer = {
        id: '1',
        title: 'Senior Software Engineer',
        description: 'Join our engineering team',
        requirements: 'Bachelor degree in CS',
        location: 'Remote',
        type: 'FULL_TIME',
        salary: '$100,000 - $140,000',
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      };

      mockPrisma.career.update.mockResolvedValue(updatedCareer);

      const request = new NextRequest('http://localhost:3000/api/careers/1', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await updateCareer(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.career).toEqual(updatedCareer);
      expect(mockPrisma.career.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
    });

    test('should return 401 when not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/careers/1', {
        method: 'PUT',
        body: JSON.stringify({ title: 'Updated Title' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await updateCareer(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('DELETE /api/careers/[id]', () => {
    test('should delete career when authenticated', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', email: 'admin@example.com', role: 'ADMIN' },
      } as any);

      mockPrisma.career.delete.mockResolvedValue({
        id: '1',
        title: 'Software Engineer',
      } as any);

      const request = new NextRequest('http://localhost:3000/api/careers/1', {
        method: 'DELETE',
      });

      const response = await deleteCareer(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Career deleted successfully');
      expect(mockPrisma.career.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    test('should return 401 when not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/careers/1', {
        method: 'DELETE',
      });

      const response = await deleteCareer(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });
});

describe('/api/careers/[id]/applications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/careers/[id]/applications', () => {
    test('should return applications for career when authenticated', async () => {
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', email: 'admin@example.com', role: 'ADMIN' },
      } as any);

      const mockApplications = [
        {
          id: '1',
          careerId: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          resume: '/uploads/resume1.pdf',
          coverLetter: 'I am interested in this position',
          status: 'PENDING',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
      ];

      mockPrisma.application.findMany.mockResolvedValue(mockApplications);

      const request = new NextRequest('http://localhost:3000/api/careers/1/applications');
      const response = await getApplications(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.applications).toEqual(mockApplications);
      expect(mockPrisma.application.findMany).toHaveBeenCalledWith({
        where: { careerId: '1' },
        orderBy: { createdAt: 'desc' },
      });
    });

    test('should return 401 when not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/careers/1/applications');
      const response = await getApplications(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('POST /api/careers/[id]/applications', () => {
    test('should create application for career', async () => {
      const applicationData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '098-765-4321',
        resume: '/uploads/resume2.pdf',
        coverLetter: 'Excited to apply for this role',
      };

      const createdApplication = {
        id: '2',
        careerId: '1',
        ...applicationData,
        status: 'PENDING',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02'),
      };

      mockPrisma.application.create.mockResolvedValue(createdApplication);

      const request = new NextRequest('http://localhost:3000/api/careers/1/applications', {
        method: 'POST',
        body: JSON.stringify(applicationData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await createApplication(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.application).toEqual(createdApplication);
      expect(mockPrisma.application.create).toHaveBeenCalledWith({
        data: {
          careerId: '1',
          ...applicationData,
          status: 'PENDING',
        },
      });
    });

    test('should validate required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/careers/1/applications', {
        method: 'POST',
        body: JSON.stringify({ name: 'John' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await createApplication(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    test('should validate email format', async () => {
      const applicationData = {
        name: 'John Doe',
        email: 'invalid-email',
        phone: '123-456-7890',
        resume: '/uploads/resume.pdf',
        coverLetter: 'Cover letter text',
      };

      const request = new NextRequest('http://localhost:3000/api/careers/1/applications', {
        method: 'POST',
        body: JSON.stringify(applicationData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await createApplication(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid email format');
    });
  });
});