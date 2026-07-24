import { NextRequest, NextResponse } from 'next/server';
import { GET, POST, PUT, DELETE } from '@/app/api/services/route';
import { GET as getById, PUT as updateById, DELETE as deleteById } from '@/app/api/services/[id]/route';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockService = {
    id: 1,
    title: 'Test Service',
    description: 'Test service description',
    content: 'Test service content',
    slug: 'test-service',
    image: '/images/test-service.jpg',
    features: ['Feature 1', 'Feature 2'],
    price: 1000,
    published: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  };

  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      service: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      },
      $disconnect: jest.fn()
    }))
  };
});

// Mock NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn()
}));

const mockPrisma = new PrismaClient();

describe('/api/services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/services', () => {
    it('should return all published services', async () => {
      const mockServices = [
        {
          id: 1,
          title: 'Service 1',
          description: 'Description 1',
          content: 'Content 1',
          slug: 'service-1',
          image: '/images/service-1.jpg',
          features: ['Feature 1'],
          price: 1000,
          published: true,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01')
        },
        {
          id: 2,
          title: 'Service 2',
          description: 'Description 2',
          content: 'Content 2',
          slug: 'service-2',
          image: '/images/service-2.jpg',
          features: ['Feature 2'],
          price: 2000,
          published: true,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01')
        }
      ];

      (mockPrisma.service.findMany as jest.Mock).mockResolvedValue(mockServices);

      const request = new NextRequest('http://localhost:3000/api/services');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.services).toHaveLength(2);
      expect(mockPrisma.service.findMany).toHaveBeenCalledWith({
        where: { published: true },
        orderBy: { createdAt: 'desc' }
      });
    });

    it('should handle database errors', async () => {
      (mockPrisma.service.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/services');
      const response = await GET(request);

      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/services', () => {
    it('should create a new service when authenticated', async () => {
      const mockSession = { user: { email: 'admin@test.com', role: 'ADMIN' } };
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);

      const newService = {
        title: 'New Service',
        description: 'New service description',
        content: 'New service content',
        slug: 'new-service',
        image: '/images/new-service.jpg',
        features: ['Feature 1', 'Feature 2'],
        price: 1500,
        published: true
      };

      const createdService = { id: 3, ...newService, createdAt: new Date(), updatedAt: new Date() };
      (mockPrisma.service.create as jest.Mock).mockResolvedValue(createdService);

      const request = new NextRequest('http://localhost:3000/api/services', {
        method: 'POST',
        body: JSON.stringify(newService),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.service.title).toBe('New Service');
      expect(mockPrisma.service.create).toHaveBeenCalledWith({
        data: newService
      });
    });

    it('should return 401 when not authenticated', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/services', {
        method: 'POST',
        body: JSON.stringify({ title: 'Test' }),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const mockSession = { user: { email: 'admin@test.com', role: 'ADMIN' } };
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);

      const request = new NextRequest('http://localhost:3000/api/services', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it('should handle duplicate slug errors', async () => {
      const mockSession = { user: { email: 'admin@test.com', role: 'ADMIN' } };
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);

      const error = new Error('Unique constraint failed');
      (error as any).code = 'P2002';
      (mockPrisma.service.create as jest.Mock).mockRejectedValue(error);

      const request = new NextRequest('http://localhost:3000/api/services', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Duplicate Service',
          description: 'Description',
          content: 'Content',
          slug: 'existing-slug',
          price: 1000
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });
});

describe('/api/services/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/services/[id]', () => {
    it('should return service by id', async () => {
      const mockService = {
        id: 1,
        title: 'Test Service',
        description: 'Test description',
        content: 'Test content',
        slug: 'test-service',
        image: '/images/test-service.jpg',
        features: ['Feature 1'],
        price: 1000,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (mockPrisma.service.findUnique as jest.Mock).mockResolvedValue(mockService);

      const request = new NextRequest('http://localhost:3000/api/services/1');
      const response = await getById(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.service.id).toBe(1);
      expect(mockPrisma.service.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    it('should return 404 for non-existent service', async () => {
      (mockPrisma.service.findUnique as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/services/999');
      const response = await getById(request, { params: { id: '999' } });

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid id', async () => {
      const request = new NextRequest('http://localhost:3000/api/services/invalid');
      const response = await getById(request, { params: { id: 'invalid' } });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/services/[id]', () => {
    it('should update service when authenticated', async () => {
      const mockSession = { user: { email: 'admin@test.com', role: 'ADMIN' } };
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);

      const updatedService = {
        id: 1,
        title: 'Updated Service',
        description: 'Updated description',
        content: 'Updated content',
        slug: 'updated-service',
        image: '/images/updated-service.jpg',
        features: ['Updated Feature'],
        price: 1200,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (mockPrisma.service.update as jest.Mock).mockResolvedValue(updatedService);

      const updateData = {
        title: 'Updated Service',
        description: 'Updated description',
        price: 1200
      };

      const request = new NextRequest('http://localhost:3000/api/services/1', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await updateById(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.service.title).toBe('Updated Service');
      expect(mockPrisma.service.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData
      });
    });

    it('should return 401 when not authenticated', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/services/1', {
        method: 'PUT',
        body: JSON.stringify({ title: 'Updated' }),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await updateById(request, { params: { id: '1' } });

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent service', async () => {
      const mockSession = { user: { email: 'admin@test.com', role: 'ADMIN' } };
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);

      const error = new Error('Record not found');
      (error as any).code = 'P2025';
      (mockPrisma.service.update as jest.Mock).mockRejectedValue(error);

      const request = new NextRequest('http://localhost:3000/api/services/999', {
        method: 'PUT',
        body: JSON.stringify({ title: 'Updated' }),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await updateById(request, { params: { id: '999' } });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/services/[id]', () => {
    it('should delete service when authenticated', async () => {
      const mockSession = { user: { email: 'admin@test.com', role: 'ADMIN' } };
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);

      (mockPrisma.service.delete as jest.Mock).mockResolvedValue({ id: 1 });

      const request = new NextRequest('http://localhost:3000/api/services/1', {
        method: 'DELETE'
      });

      const response = await deleteById(request, { params: { id: '1' } });

      expect(response.status).toBe(200);
      expect(mockPrisma.service.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    it('should return 401 when not authenticated', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/services/1', {
        method: 'DELETE'
      });

      const response = await deleteById(request, { params: { id: '1' } });

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent service', async () => {
      const mockSession = { user: { email: 'admin@test.com', role: 'ADMIN' } };
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);

      const error = new Error('Record not found');
      (error as any).code = 'P2025';
      (mockPrisma.service.delete as jest.Mock).mockRejectedValue(error);

      const request = new NextRequest('http://localhost:3000/api/services/999', {
        method: 'DELETE'
      });

      const response = await deleteById(request, { params: { id: '999' } });

      expect(response.status).toBe(404);
    });
  });
});