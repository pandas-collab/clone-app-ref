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
  });

  describe('DELETE /api/services/[id]', () => {
    it('should delete service successfully with authentication', async () => {
      (getServerSession as any).mockResolvedValue(mockSession);
      (prisma.service.findUnique as any).mockResolvedValue(mockService);
      (prisma.service.delete as any).mockResolvedValue(mockService);

      const request = new NextRequest('http://localhost:3000/api/services/1', {
        method: 'DELETE',
      });

      const response = await deleteById(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Service deleted successfully');
      expect(prisma.service.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should reject deletion without authentication', async () => {
      (getServerSession as any).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/services/1', {
        method: 'DELETE',
      });

      const response = await deleteById(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 404 for non-existent service deletion', async () => {
      (getServerSession as any).mockResolvedValue(mockSession);
      (prisma.service.findUnique as any).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/services/999', {
        method: 'DELETE',
      });

      const response = await deleteById(request, { params: { id: '999' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Service not found');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON in request body', async () => {
      (getServerSession as any).mockResolvedValue(mockSession);

      const request = new NextRequest('http://localhost:3000/api/services', {
        method: 'POST',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid JSON format');
    });

    it('should handle database connection errors', async () => {
      (prisma.service.findMany as any).mockRejectedValue(new Error('Connection failed'));

      const request = new NextRequest('http://localhost:3000/api/services');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch services');
    });

    it('should handle large request payloads', async () => {
      (getServerSession as any).mockResolvedValue(mockSession);

      const largeContent = 'a'.repeat(100000);
      const largeData = {
        ...mockService,
        content: largeContent,
      };

      const request = new NextRequest('http://localhost:3000/api/services', {
        method: 'POST',
        body: JSON.stringify(largeData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Content too large');
    });
  });

  describe('Data Validation', () => {
    it('should validate price is a positive number', async () => {
      (getServerSession as any).mockResolvedValue(mockSession);

      const invalidData = {
        title: 'Test Service',
        description: 'Test description',
        price: -100,
      };

      const request = new NextRequest('http://localhost:3000/api/services', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Price must be a positive number');
    });

    it('should validate features array format', async () => {
      (getServerSession as any).mockResolvedValue(mockSession);

      const invalidData = {
        title: 'Test Service',
        description: 'Test description',
        features: 'not an array',
      };

      const request = new NextRequest('http://localhost:3000/api/services', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Features must be an array');
    });
  });
});