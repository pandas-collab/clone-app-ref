import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { NextRequest, NextResponse } from 'next/server';
import { GET, POST, PUT, DELETE } from '../../src/app/api/portfolio/route';
import { GET as getPortfolioItem, PUT as updatePortfolioItem, DELETE as deletePortfolioItem } from '../../src/app/api/portfolio/[id]/route';
import { GET as getById, PUT as updateById, DELETE as deleteById } from '@/app/api/portfolio/[id]/route';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { getServerSession as getServerSessionNext } from 'next-auth/next';

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    portfolio: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $disconnect: jest.fn(),
  })),
}));

// Mock NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

// Mock file system operations
jest.mock('fs/promises', () => ({
  writeFile: jest.fn(),
  unlink: jest.fn(),
}));

jest.mock('next/server');

const mockPrisma = new PrismaClient();
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockGetServerSessionNext = getServerSessionNext as jest.MockedFunction<typeof getServerSessionNext>;

describe('Portfolio API', () => {
  let mockRequest: Partial<NextRequest>;
  let mockParams: { params: { id: string } };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      json: jest.fn(),
      nextUrl: {
        searchParams: new URLSearchParams(),
      } as any,
    };
    mockParams = { params: { id: '1' } };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/portfolio', () => {
    it('should return all portfolio items', async () => {
      const mockPortfolioItems = [
        {
          id: 1,
          title: 'Test Portfolio 1',
          description: 'Test description 1',
          slug: 'test-portfolio-1',
          imageUrl: '/images/test1.jpg',
          technologies: ['React', 'TypeScript'],
          projectUrl: 'https://example1.com',
          githubUrl: 'https://github.com/test/project1',
          featured: true,
          published: true,
          status: 'PUBLISHED',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Test Portfolio 2',
          description: 'Test description 2',
          slug: 'test-portfolio-2',
          imageUrl: '/images/test2.jpg',
          technologies: ['Next.js', 'Prisma'],
          projectUrl: 'https://example2.com',
          githubUrl: 'https://github.com/test/project2',
          featured: false,
          published: true,
          status: 'DRAFT',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockPrisma.portfolio.findMany as jest.Mock).mockResolvedValue(mockPortfolioItems);

      const request = new NextRequest('http://localhost:3000/api/portfolio');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockPortfolioItems);
      expect(mockPrisma.portfolio.findMany).toHaveBeenCalledWith({
        where: { published: true },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      });
    });

    it('should return all portfolio items successfully', async () => {
      const mockPortfolioItems = [
        {
          id: 1,
          title: 'Project 1',
          description: 'Description 1',
          slug: 'project-1',
          imageUrl: '/images/project1.jpg',
          technologies: ['React', 'TypeScript'],
          projectUrl: 'https://project1.com',
          githubUrl: 'https://github.com/user/project1',
          featured: true,
          status: 'PUBLISHED',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Project 2',
          description: 'Description 2',
          slug: 'project-2',
          imageUrl: '/images/project2.jpg',
          technologies: ['Next.js', 'Prisma'],
          projectUrl: 'https://project2.com',
          githubUrl: 'https://github.com/user/project2',
          featured: false,
          status: 'DRAFT',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockPrisma.portfolio.findMany as jest.Mock).mockResolvedValue(mockPortfolioItems);

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockPortfolioItems);
      expect(mockPrisma.portfolio.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return filtered portfolio items by status', async () => {
      const publishedItems = [
        {
          id: 1,
          title: 'Published Project',
          status: 'PUBLISHED',
        },
      ];

      mockRequest.nextUrl!.searchParams.set('status', 'PUBLISHED');
      (mockPrisma.portfolio.findMany as jest.Mock).mockResolvedValue(publishedItems);

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockPrisma.portfolio.findMany).toHaveBeenCalledWith({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return featured portfolio items only', async () => {
      const featuredItems = [
        {
          id: 1,
          title: 'Featured Project',
          featured: true,
        },
      ];

      mockRequest.nextUrl!.searchParams.set('featured', 'true');
      (mockPrisma.portfolio.findMany as jest.Mock).mockResolvedValue(featuredItems);

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockPrisma.portfolio.findMany).toHaveBeenCalledWith({
        where: { featured: true },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return empty array when no portfolio items exist', async () => {
      (mockPrisma.portfolio.findMany as jest.Mock).mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/portfolio');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual([]);
    });

    it('should handle database errors', async () => {
      (mockPrisma.portfolio.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/portfolio');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.message).toContain('Failed to fetch portfolio items');
    });

    it('should handle database error', async () => {
      (mockPrisma.portfolio.findMany as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('POST /api/portfolio', () => {
    const mockSession = {
      user: { id: '1', email: 'admin@example.com', role: 'admin' },
    };

    const mockPortfolioData = {
      title: 'New Project',
      description: 'New project description',
      slug: 'new-project',
      imageUrl: '/images/new-project.jpg',
      technologies: ['React', 'Node.js'],
      projectUrl: 'https://newproject.com',
      githubUrl: 'https://github.com/user/newproject',
      featured: true,
      status: 'PUBLISHED',
    };

    it('should create a new portfolio item', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);

      const newPortfolioItem = {
        title: 'New Portfolio Item',
        description: 'New description',
        technologies: ['React', 'Node.js'],
        projectUrl: 'https://newproject.com',
        githubUrl: 'https://github.com/test/newproject',
        featured: false,
        published: true,
      };

      const createdPortfolioItem = {
        id: 3,
        ...newPortfolioItem,
        slug: 'new-portfolio-item',
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.portfolio.create as jest.Mock).mockResolvedValue(createdPortfolioItem);

      const request = new NextRequest('http://localhost:3000/api/portfolio', {
        method: 'POST',
        body: JSON.stringify(newPortfolioItem),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(createdPortfolioItem);
      expect(mockPrisma.portfolio.create).toHaveBeenCalledWith({
        data: {
          ...newPortfolioItem,
          slug: 'new-portfolio-item',
        },
      });
    });

    it('should create portfolio item successfully when authenticated', async () => {
      const createdItem = { id: 1, ...mockPortfolioData, createdAt: new Date(), updatedAt: new Date() };

      mockGetServerSessionNext.mockResolvedValue({ user: { email: 'admin@example.com' } } as any);
      (mockRequest.json as jest.Mock).mockResolvedValue(mockPortfolioData);
      (mockPrisma.portfolio.create as jest.Mock).mockResolvedValue(createdItem);

      const response = await POST(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(createdItem);
      expect(mockPrisma.portfolio.create).toHaveBeenCalledWith({
        data: mockPortfolioData,
      });
    });

    it('should require authentication', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/portfolio', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Authentication required');
    });

    it('should return 401 when not authenticated', async () => {
      mockGetServerSessionNext.mockResolvedValue(null);

      const response = await POST(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
    });

    it('should validate required fields', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);

      const invalidData = {
        description: 'Missing title',
      };

      const request = new NextRequest('http://localhost:3000/api/portfolio', {
        method: 'POST',
        body: JSON.stringify(invalidData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toContain('validation');
    });

    it('should return 400 for invalid data', async () => {
      mockGetServerSessionNext.mockResolvedValue({ user: { email: 'admin@example.com' } } as any);
      (mockRequest.json as jest.Mock).mockResolvedValue({
        title: '', // Invalid: empty title
      });

      const response = await POST(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Title and description are required');
    });

    it('should handle duplicate slug errors', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);

      const duplicateItem = {
        title: 'Duplicate Title',
        description: 'Description',
        technologies: ['React'],
        published: true,
      };

      const duplicateError = new Error('Unique constraint failed on the fields: (`slug`)');
      (duplicateError as any).code = 'P2002';
      (mockPrisma.portfolio.create as jest.Mock).mockRejectedValue(duplicateError);

      const request = new NextRequest('http://localhost:3000/api/portfolio', {
        method: 'POST',
        body: JSON.stringify(duplicateItem),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.message).toContain('already exists');
    });

    it('should handle duplicate slug error', async () => {
      mockGetServerSessionNext.mockResolvedValue({ user: { email: 'admin@example.com' } } as any);
      (mockRequest.json as jest.Mock).mockResolvedValue(mockPortfolioData);
      (mockPrisma.portfolio.create as jest.Mock).mockRejectedValue({ code: 'P2002', meta: { target: ['slug'] } });

      const response = await POST(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Portfolio item with this slug already exists');
    });
  });

  describe('GET /api/portfolio/[id]', () => {
    it('should return specific portfolio item', async () => {
      const mockPortfolioItem = {
        id: 1,
        title: 'Test Portfolio',
        description: 'Test description',
        slug: 'test-portfolio',
        imageUrl: '/images/test.jpg',
        technologies: ['React'],
        projectUrl: 'https://example.com',
        githubUrl: 'https://github.com/test/project',
        featured: true,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.portfolio.findUnique as jest.Mock).mockResolvedValue(mockPortfolioItem);

      const request = new NextRequest('http://localhost:3000/api/portfolio/1');
      const response = await getPortfolioItem(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockPortfolioItem);
      expect(mockPrisma.portfolio.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return portfolio item by id successfully', async () => {
      const mockPortfolioItem = {
        id: 1,
        title: 'Test Project',
        description: 'Test description',
        slug: 'test-project',
        imageUrl: '/images/test.jpg',
        technologies: ['React'],
        projectUrl: 'https://test.com',
        githubUrl: 'https://github.com/user/test',
        featured: false,
        status: 'PUBLISHED',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.portfolio.findUnique as jest.Mock).mockResolvedValue(mockPortfolioItem);

      const response = await getById(mockRequest as NextRequest, mockParams);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockPortfolioItem);
      expect(mockPrisma.portfolio.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return 404 for non-existent portfolio item', async () => {
      (mockPrisma.portfolio.findUnique as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/portfolio/999');
      const response = await getPortfolioItem(request, { params: { id: '999' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Portfolio item not found');
    });

    it('should return 404 for non-existent portfolio item (alt)', async () => {
      (mockPrisma.portfolio.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await getById(mockRequest as NextRequest, mockParams);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Portfolio item not found');
    });

    it('should handle invalid ID format', async () => {
      const request = new NextRequest('http://localhost:3000/api/portfolio/invalid');
      const response = await getPortfolioItem(request, { params: { id: 'invalid' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toContain('Invalid ID format');
    });

    it('should return 400 for invalid id', async () => {
      const invalidParams = { params: { id: 'invalid' } };

      const response = await getById(mockRequest as NextRequest, invalidParams);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid portfolio item ID');
    });
  });

  describe('PUT /api/portfolio/[id]', () => {
    const mockSession = {
      user: { id: '1', email: 'admin@example.com', role: 'admin' },
    };

    const updateData = {
      title: 'Updated Project',
      description: 'Updated description',
      featured: true,
    };

    it('should update portfolio item', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);

      const updateDataOriginal = {
        title: 'Updated Portfolio',
        description: 'Updated description',
        technologies: ['React', 'TypeScript'],
        featured: true,
      };

      const updatedItem = {
        id: 1,
        ...updateDataOriginal,
        slug: 'updated-portfolio',
        imageUrl: '/images/updated.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.portfolio.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrisma.portfolio.update as jest.Mock).mockResolvedValue(updatedItem);

      const request = new NextRequest('http://localhost:3000/api/portfolio/1', {
        method: 'PUT',
        body: JSON.stringify(updateDataOriginal),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await updatePortfolioItem(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(updatedItem);
    });

    it('should update portfolio item successfully when authenticated', async () => {
      const updatedItem = {
        id: 1,
        ...updateData,
        slug: 'test-project',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockGetServerSessionNext.mockResolvedValue({ user: { email: 'admin@example.com' } } as any);
      (mockRequest.json as jest.Mock).mockResolvedValue(updateData);
      (mockPrisma.portfolio.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrisma.portfolio.update as jest.Mock).mockResolvedValue(updatedItem);

      const response = await updateById(mockRequest as NextRequest, mockParams);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(updatedItem);
      expect(mockPrisma.portfolio.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
    });
  });

  describe('DELETE /api/portfolio/[id]', () => {
    const mockSession = {
      user: { id: '1', email: 'admin@example.com', role: 'admin' },
    };

    it('should delete portfolio item successfully when authenticated', async () => {
      mockGetServerSessionNext.mockResolvedValue({ user: { email: 'admin@example.com' } } as any);
      (mockPrisma.portfolio.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
      (mockPrisma.portfolio.delete as jest.Mock).mockResolvedValue({ id: 1 });

      const response = await deleteById(mockRequest as NextRequest, mockParams);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockPrisma.portfolio.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should require authentication for delete', async () => {
      mockGetServerSessionNext.mockResolvedValue(null);

      const response = await deleteById(mockRequest as NextRequest, mockParams);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 404 for non-existent item to delete', async () => {
      mockGetServerSessionNext.mockResolvedValue({ user: { email: 'admin@example.com' } } as any);
      (mockPrisma.portfolio.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await deleteById(mockRequest as NextRequest, mockParams);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Portfolio item not found');
    });
  });
});
