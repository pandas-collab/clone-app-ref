import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { GET, POST, PUT, DELETE } from '@/app/api/services/route';
import { GET as getById, PUT as updateById, DELETE as deleteById } from '@/app/api/services/[id]/route';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    service: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
  },
}));

// Mock NextAuth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

// Mock authConfig
vi.mock('@/lib/auth', () => ({
  authConfig: {},
}));

const mockService = {
  id: '1',
  title: 'Web Development',
  slug: 'web-development',
  description: 'Professional web development services',
  content: 'Detailed content about web development services',
  image: '/images/web-dev.jpg',
  price: 5000,
  features: ['Responsive Design', 'SEO Optimization', 'Modern UI'],
  category: 'Development',
  published: true,
  featured: false,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockSession = {
  user: { id: '1', email: 'admin@example.com', role: 'admin' },
};

describe('Services API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/services', () => {
    it('should return all services successfully', async () => {
      const mockServices = [mockService];
      (prisma.service.findMany as any).mockResolvedValue(mockServices);

      const request = new NextRequest('http://localhost:3000/api/services');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.services).toEqual(mockServices);
      expect(prisma.service.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        where: {},
      });
    });

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

      (prisma.service.findMany as any).mockResolvedValue(mockServices);

      const request = new NextRequest('http://localhost:3000/api/services');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.services).toHaveLength(2);
    });

    it('should filter services by category', async () => {
      const mockServices = [mockService];
      (prisma.service.findMany as any).mockResolvedValue(mockServices);

      const request = new NextRequest('http://localhost:3000/api/services?category=Development');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(prisma.service.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        where: { category: 'Development' },
      });
    });

    it('should filter services by published status', async () => {
      const mockServices = [mockService];
      (prisma.service.findMany as any).mockResolvedValue(mockServices);

      const request = new NextRequest('http://localhost:3000/api/services?published=true');
      const response = await GET(request);

      expect(prisma.service.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
        where: { published: true },
      });
    });

    it('should handle database errors', async () => {
      (prisma.service.findMany as any).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/services');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch services');
    });
  });

  describe('POST /api/services', () => {
    const validServiceData = {
      title: 'New Service',
      description: 'Service description',
      content: 'Service content',
      price: 3000,
      category: 'Consulting',
      features: ['Feature 1', 'Feature 2'],
    };

    it('should create service successfully with admin authentication', async () => {
      (getServerSession as any).mockResolvedValue(mockSession);
      (prisma.service.create as any).mockResolvedValue({ ...mockService, ...validServiceData });

      const request = new NextRequest('http://localhost:3000/api/services', {
        method: 'POST',
        body: JSON.stringify(validServiceData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.service).toBeDefined();
      expect(prisma.service.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: validServiceData.title,
          slug: expect.any(String),
          description: validServiceData.description,
          content: validServiceData.content,
          price: validServiceData.price,
          category: validServiceData.category,
          features: validServiceData.features,
          published: false,
          featured: false,
        }),
      });
    });

    it('should create a new service when authenticated', async () => {
      const mockSession = { user: { email: 'admin@test.com', role: 'ADMIN' } };
      (getServerSession as any).mockResolvedValue(mockSession);

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
      (prisma.service.create as any).mockResolvedValue(createdService);

      const request = new NextRequest('http://localhost:3000/api/services', {
        method: 'POST',
        body: JSON.stringify(newService),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.service.title).toBe('New Service');
    });

    it('should reject creation without authentication', async () => {
      (getServerSession as any).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/services', {
        method: 'POST',
        body: JSON.stringify(validServiceData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 401 when not authenticated', async () => {
      (getServerSession as any).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/services', {
        method: 'POST',
        body: JSON.stringify({ title: 'Test' }),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await POST(request);

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      (getServerSession as any).mockResolvedValue(mockSession);

      const invalidData = { title: '', description: '' };
      const request = new NextRequest('http://localhost:3000/api/services', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required fields');
    });

    it('should handle duplicate slug creation', async () => {
      (getServerSession as any).mockResolvedValue(mockSession);
      (prisma.service.create as any).mockRejectedValue({ code: 'P2002' });

      const request = new NextRequest('http://localhost:3000/api/services', {
        method: 'POST',
        body: JSON.stringify(validServiceData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('A service with this title already exists');
    });

    it('should handle duplicate slug errors', async () => {
      const mockSession = { user: { email: 'admin@test.com', role: 'ADMIN' } };
      (getServerSession as any).mockResolvedValue(mockSession);

      const error = new Error('Unique constraint failed');
      (error as any).code = 'P2002';
      (prisma.service.create as any).mockRejectedValue(error);

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

  describe('GET /api/services/[id]', () => {
    it('should return service by ID successfully', async () => {
      (prisma.service.findUnique as any).mockResolvedValue(mockService);

      const request = new NextRequest('http://localhost:3000/api/services/1');
      const response = await getById(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.service).toEqual(mockService);
      expect(prisma.service.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

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

      (prisma.service.findUnique as any).mockResolvedValue(mockService);

      const request = new NextRequest('http://localhost:3000/api/services/1');
      const response = await getById(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.service.id).toBe(1);
    });

    it('should return 404 for non-existent service', async () => {
      (prisma.service.findUnique as any).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/services/999');
      const response = await getById(request, { params: { id: '999' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Service not found');
    });

    it('should handle invalid ID format', async () => {
      const request = new NextRequest('http://localhost:3000/api/services/invalid');
      const response = await getById(request, { params: { id: 'invalid' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid service ID');
    });

    it('should return 400 for invalid id', async () => {
      const request = new NextRequest('http://localhost:3000/api/services/invalid');
      const response = await getById(request, { params: { id: 'invalid' } });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/services/[id]', () => {
    const updateData = {
      title: 'Updated Service',
      description: 'Updated description',
      price: 4000,
    };

    it('should update service successfully with authentication', async () => {
      (getServerSession as any).mockResolvedValue(mockSession);
      (prisma.service.findUnique as any).mockResolvedValue(mockService);
      (prisma.service.update as any).mockResolvedValue({ ...mockService, ...updateData });

      const request = new NextRequest('http://localhost:3000/api/services/1', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await updateById(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.service).toBeDefined();
      expect(prisma.service.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: expect.objectContaining(updateData),
      });
    });

    it('should update service when authenticated', async () => {
      const mockSession = { user: { email: 'admin@test.com', role: 'ADMIN' } };
      (getServerSession as any).mockResolvedValue(mockSession);

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

      (prisma.service.update as any).mockResolvedValue(updatedService);

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
    });

    it('should reject update without authentication', async () => {
      (getServerSession as any).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/services/1', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await updateById(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 401 when not authenticated', async () => {
      (getServerSession as any).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/services/1', {
        method: 'PUT',
        body: JSON.stringify({ title: 'Updated' }),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await updateById(request, { params: { id: '1' } });

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent service update', async () => {
      (getServerSession as any).mockResolvedValue(mockSession);
      (prisma.service.findUnique as any).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/services/999', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await updateById(request, { params: { id: '999' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Service not found');
    });

    it('should return 404 for non-existent service', async () => {
      const mockSession = { user: { email: 'admin@test.com', role: 'ADMIN' } };
      (getServerSession as any).mockResolvedValue(mockSession);

      const error = new Error('Record not found');
      (error as any).code = 'P2025';
      (prisma.service.update as any).mockRejectedValue(error);

      const request = new NextRequest('http://localhost:3000/api/services/999', {
        method: 'PUT',
        body: JSON.stringify({ title: 'Updated' }),
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await updateById(request, { params: { id: '999' } });

      expect(response.status).toBe(404);
    });
  });
});
