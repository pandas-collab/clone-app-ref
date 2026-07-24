import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { NextRequest, NextResponse } from 'next/server';
import { GET, POST, PUT, DELETE } from '../../src/app/api/portfolio/route';
import { GET as getPortfolioItem, PUT as updatePortfolioItem, DELETE as deletePortfolioItem } from '../../src/app/api/portfolio/[id]/route';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

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

// Mock file system operations
jest.mock('fs/promises', () => ({
  writeFile: jest.fn(),
  unlink: jest.fn(),
}));

const mockPrisma = new PrismaClient();
const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

describe('Portfolio API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
  });

  describe('POST /api/portfolio', () => {
    const mockSession = {
      user: { id: '1', email: 'admin@example.com', role: 'admin' },
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

    it('should return 404 for non-existent portfolio item', async () => {
      (mockPrisma.portfolio.findUnique as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/portfolio/999');
      const response = await getPortfolioItem(request, { params: { id: '999' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Portfolio item not found');
    });

    it('should handle invalid ID format', async () => {
      const request = new NextRequest('http://localhost:3000/api/portfolio/invalid');
      const response = await getPortfolioItem(request, { params: { id: 'invalid' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.message).toContain('Invalid ID format');
    });
  });

  describe('PUT /api/portfolio/[id]', () => {
    const mockSession = {
      user: { id: '1', email: 'admin@example.com', role: 'admin' },
    };

    it('should update portfolio item', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);

      const updateData = {
        title: 'Updated Portfolio',
        description: 'Updated description',
        technologies: ['React', 'TypeScript'],
        featured: true,
      };

      const updatedItem = {
        id: 1,
        ...updateData,
        slug: 'updated-portfolio',
        imageUrl: '/images/test.jpg',
        projectUrl: 'https://example.com',
        githubUrl: 'https://github.com/test/project',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.portfolio.update as jest.Mock).mockResolvedValue(updatedItem);

      const request = new NextRequest('http://localhost:3000/api/portfolio/1', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await updatePortfolioItem(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(updatedItem);
      expect(mockPrisma.portfolio.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...updateData,
          slug: 'updated-portfolio',
        },
      });
    });

    it('should require authentication for updates', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/portfolio/1', {
        method: 'PUT',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await updatePortfolioItem(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Authentication required');
    });
  });

  describe('DELETE /api/portfolio/[id]', () => {
    const mockSession = {
      user: { id: '1', email: 'admin@example.com', role: 'admin' },
    };

    it('should delete portfolio item', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);

      const deletedItem = {
        id: 1,
        title: 'Deleted Portfolio',
        slug: 'deleted-portfolio',
      };

      (mockPrisma.portfolio.delete as jest.Mock).mockResolvedValue(deletedItem);

      const request = new NextRequest('http://localhost:3000/api/portfolio/1', {
        method: 'DELETE',
      });

      const response = await deletePortfolioItem(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Portfolio item deleted successfully');
      expect(mockPrisma.portfolio.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should require authentication for deletion', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/portfolio/1', {
        method: 'DELETE',
      });

      const response = await deletePortfolioItem(request, { params: { id: '1' } });
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Authentication required');
    });

    it('should handle deletion of non-existent item', async () => {
      mockGetServerSession.mockResolvedValue(mockSession);

      const notFoundError = new Error('Record to delete does not exist.');
      (notFoundError as any).code = 'P2025';
      (mockPrisma.portfolio.delete as jest.Mock).mockRejectedValue(notFoundError);

      const request = new NextRequest('http://localhost:3000/api/portfolio/999', {
        method: 'DELETE',
      });

      const response = await deletePortfolioItem(request, { params: { id: '999' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Portfolio item not found');
    });
  });
});