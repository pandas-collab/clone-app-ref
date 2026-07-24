import { describe, it, expect, beforeEach, afterEach, jest, test, beforeAll, afterAll } from '@jest/globals';
import { NextRequest } from 'next/server';
import { GET, POST, PUT, DELETE } from '../../../src/app/api/careers/route';
import { GET as GET_BY_ID, PUT as PUT_BY_ID, DELETE as DELETE_BY_ID } from '../../../src/app/api/careers/[id]/route';
import { POST as APPLY } from '../../../src/app/api/careers/[id]/applications/route';
import { GET as getCareer, PUT as updateCareer, DELETE as deleteCareer } from '../../../src/app/api/careers/[id]/route';
import { GET as getApplications, POST as createApplication } from '../../../src/app/api/careers/[id]/applications/route';
import { prisma } from '../../../src/lib/prisma';
import { getServerSession } from 'next-auth';

// Mock Prisma
jest.mock('../../../src/lib/prisma', () => ({
  prisma: {
    career: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    application: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

// Mock NextAuth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('next-auth');
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Careers API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /api/careers', () => {
    it('should return all careers', async () => {
      const mockCareers = [
        {
          id: '1',
          title: 'Software Engineer',
          description: 'Join our development team',
          requirements: 'Bachelor degree in CS',
          location: 'New York',
          type: 'FULL_TIME',
          salary: '$80,000 - $120,000',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          title: 'Product Manager',
          description: 'Lead product development',
          requirements: 'Experience in product management',
          location: 'San Francisco',
          type: 'FULL_TIME',
          salary: '$100,000 - $150,000',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.career.findMany.mockResolvedValue(mockCareers);

      const request = new NextRequest('http://localhost:3000/api/careers');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockCareers);
      expect(mockPrisma.career.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });
    });

    test('should return all careers (alt format)', async () => {
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
      expect(data.careers || data).toBeTruthy();
      expect(mockPrisma.career.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should handle database errors', async () => {
      mockPrisma.career.findMany.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/careers');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch careers');
    });

    it('should filter by location when provided', async () => {
      const mockCareers = [
        {
          id: '1',
          title: 'Software Engineer',
          description: 'Join our development team',
          requirements: 'Bachelor degree in CS',
          location: 'New York',
          type: 'FULL_TIME',
          salary: '$80,000 - $120,000',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.career.findMany.mockResolvedValue(mockCareers);

      const request = new NextRequest('http://localhost:3000/api/careers?location=New York');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.career.findMany).toHaveBeenCalledWith({
        where: { 
          isActive: true,
          location: { contains: 'New York', mode: 'insensitive' }
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter by type when provided', async () => {
      const mockCareers = [];
      mockPrisma.career.findMany.mockResolvedValue(mockCareers);

      const request = new NextRequest('http://localhost:3000/api/careers?type=PART_TIME');
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(mockPrisma.career.findMany).toHaveBeenCalledWith({
        where: { 
          isActive: true,
          type: 'PART_TIME'
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('POST /api/careers', () => {
    const mockSession = { user: { email: 'admin@example.com', role: 'ADMIN' } };

    beforeEach(() => {
      const { getServerSession } = require('next-auth/next');
      getServerSession.mockResolvedValue(mockSession);
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', email: 'admin@example.com', role: 'ADMIN' },
      } as any);
    });

    it('should create a new career', async () => {
      const newCareer = {
        title: 'UX Designer',
        description: 'Design amazing user experiences',
        requirements: 'Portfolio required',
        location: 'Remote',
        type: 'FULL_TIME',
        salary: '$70,000 - $100,000',
      };

      const createdCareer = {
        id: '3',
        ...newCareer,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.career.create.mockResolvedValue(createdCareer);

      const request = new NextRequest('http://localhost:3000/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCareer),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(createdCareer);
      expect(mockPrisma.career.create).toHaveBeenCalledWith({
        data: newCareer,
      });
    });

    test('should create a new career when authenticated', async () => {
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
      expect(data.career || data).toBeTruthy();
      expect(mockPrisma.career.create).toHaveBeenCalledWith({
        data: newCareer,
      });
    });

    it('should return 401 for unauthenticated users', async () => {
      const { getServerSession } = require('next-auth/next');
      getServerSession.mockResolvedValue(null);
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should validate required fields', async () => {
      const invalidCareer = {
        title: '',
        description: 'Missing title',
      };

      const request = new NextRequest('http://localhost:3000/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidCareer),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should handle database errors during creation', async () => {
      const newCareer = {
        title: 'Test Position',
        description: 'Test description',
        requirements: 'Test requirements',
        location: 'Test location',
        type: 'FULL_TIME',
        salary: '$50,000',
      };

      mockPrisma.career.create.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCareer),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to create career');
    });
  });

  describe('GET /api/careers/[id]', () => {
    it('should return a specific career', async () => {
      const mockCareer = {
        id: '1',
        title: 'Software Engineer',
        description: 'Join our development team',
        requirements: 'Bachelor degree in CS',
        location: 'New York',
        type: 'FULL_TIME',
        salary: '$80,000 - $120,000',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.career.findUnique.mockResolvedValue(mockCareer);

      const response = await GET_BY_ID(
        new NextRequest('http://localhost:3000/api/careers/1'),
        { params: { id: '1' } }
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockCareer);
      expect(mockPrisma.career.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

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
      expect(data.career || data).toBeTruthy();
      expect(mockPrisma.career.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return 404 for non-existent career', async () => {
      mockPrisma.career.findUnique.mockResolvedValue(null);

      const response = await GET_BY_ID(
        new NextRequest('http://localhost:3000/api/careers/999'),
        { params: { id: '999' } }
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Career not found');
    });

    it('should handle database errors', async () => {
      mockPrisma.career.findUnique.mockRejectedValue(new Error('Database error'));

      const response = await GET_BY_ID(
        new NextRequest('http://localhost:3000/api/careers/1'),
        { params: { id: '1' } }
      );
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch career');
    });
  });

  describe('PUT /api/careers/[id]', () => {
    const mockSession = { user: { email: 'admin@example.com', role: 'ADMIN' } };

    beforeEach(() => {
      const { getServerSession } = require('next-auth/next');
      getServerSession.mockResolvedValue(mockSession);
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', email: 'admin@example.com', role: 'ADMIN' },
      } as any);
    });

    it('should update a career', async () => {
      const updatedData = {
        title: 'Senior Software Engineer',
        salary: '$100,000 - $140,000',
      };

      const updatedCareer = {
        id: '1',
        title: 'Senior Software Engineer',
        description: 'Join our development team',
        requirements: 'Bachelor degree in CS',
        location: 'New York',
        type: 'FULL_TIME',
        salary: '$100,000 - $140,000',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.career.update.mockResolvedValue(updatedCareer);

      const request = new NextRequest('http://localhost:3000/api/careers/1', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      const response = await PUT_BY_ID(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(updatedCareer);
      expect(mockPrisma.career.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updatedData,
      });
    });

    test('should update career when authenticated', async () => {
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
      expect(data.career || data).toBeTruthy();
      expect(mockPrisma.career.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
    });

    it('should return 401 when not authenticated', async () => {
      const { getServerSession } = require('next-auth/next');
      getServerSession.mockResolvedValue(null);
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
    const mockSession = { user: { email: 'admin@example.com', role: 'ADMIN' } };

    beforeEach(() => {
      const { getServerSession } = require('next-auth/next');
      getServerSession.mockResolvedValue(mockSession);
      mockGetServerSession.mockResolvedValue({
        user: { id: '1', email: 'admin@example.com', role: 'ADMIN' },
      } as any);
    });

    test('should delete career when authenticated', async () => {
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

    it('should return 401 when not authenticated', async () => {
      const { getServerSession } = require('next-auth/next');
      getServerSession.mockResolvedValue(null);
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/careers/1', {
        method: 'DELETE',
      });

      const response = await DELETE_BY_ID(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });
  });
});
