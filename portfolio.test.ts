import { NextRequest, NextResponse } from 'next/server';
import { GET, POST, PUT, DELETE } from '@/app/api/portfolio/route';
import { GET as getById, PUT as updateById, DELETE as deleteById } from '@/app/api/portfolio/[id]/route';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';

// Mock dependencies
jest.mock('@prisma/client');
jest.mock('next-auth/next');
jest.mock('next/server');

const mockPrisma = {
  portfolio: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
} as any;

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;

// Mock PrismaClient constructor
(PrismaClient as jest.MockedClass<typeof PrismaClient>).mockImplementation(() => mockPrisma);

describe('/api/portfolio', () => {
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

  describe('GET /api/portfolio', () => {
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

      mockPrisma.portfolio.findMany.mockResolvedValue(mockPortfolioItems);

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
      mockPrisma.portfolio.findMany.mockResolvedValue(publishedItems);

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
      mockPrisma.portfolio.findMany.mockResolvedValue(featuredItems);

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockPrisma.portfolio.findMany).toHaveBeenCalledWith({
        where: { featured: true },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should handle database error', async () => {
      mockPrisma.portfolio.findMany.mockRejectedValue(new Error('Database connection failed'));

      const response = await GET(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Internal server error');
    });
  });

  describe('POST /api/portfolio', () => {
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

    it('should create portfolio item successfully when authenticated', async () => {
      const createdItem = { id: 1, ...mockPortfolioData, createdAt: new Date(), updatedAt: new Date() };

      mockGetServerSession.mockResolvedValue({ user: { email: 'admin@example.com' } } as any);
      (mockRequest.json as jest.Mock).mockResolvedValue(mockPortfolioData);
      mockPrisma.portfolio.create.mockResolvedValue(createdItem);

      const response = await POST(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(createdItem);
      expect(mockPrisma.portfolio.create).toHaveBeenCalledWith({
        data: mockPortfolioData,
      });
    });

    it('should return 401 when not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const response = await POST(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 400 for invalid data', async () => {
      mockGetServerSession.mockResolvedValue({ user: { email: 'admin@example.com' } } as any);
      (mockRequest.json as jest.Mock).mockResolvedValue({
        title: '', // Invalid: empty title
      });

      const response = await POST(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Title and description are required');
    });

    it('should handle duplicate slug error', async () => {
      mockGetServerSession.mockResolvedValue({ user: { email: 'admin@example.com' } } as any);
      (mockRequest.json as jest.Mock).mockResolvedValue(mockPortfolioData);
      mockPrisma.portfolio.create.mockRejectedValue({ code: 'P2002', meta: { target: ['slug'] } });

      const response = await POST(mockRequest as NextRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Portfolio item with this slug already exists');
    });
  });
});

describe('/api/portfolio/[id]', () => {
  let mockRequest: Partial<NextRequest>;
  let mockParams: { params: { id: string } };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {
      json: jest.fn(),
    };
    mockParams = { params: { id: '1' } };
  });

  describe('GET /api/portfolio/[id]', () => {
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

      mockPrisma.portfolio.findUnique.mockResolvedValue(mockPortfolioItem);

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
      mockPrisma.portfolio.findUnique.mockResolvedValue(null);

      const response = await getById(mockRequest as NextRequest, mockParams);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Portfolio item not found');
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
    const updateData = {
      title: 'Updated Project',
      description: 'Updated description',
      featured: true,
    };

    it('should update portfolio item successfully when authenticated', async () => {
      const updatedItem = {
        id: 1,
        ...updateData,
        slug: 'test-project',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockGetServerSession.mockResolvedValue({ user: { email: 'admin@example.com' } } as any);
      (mockRequest.json as jest.Mock).mockResolvedValue(updateData);
      mockPrisma.portfolio.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.portfolio.update.mockResolvedValue(updatedItem);

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

    it('should return 401 when not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const response = await updateById(mockRequest as NextRequest, mockParams);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 404 when portfolio item not found', async () => {
      mockGetServerSession.mockResolvedValue({ user: { email: 'admin@example.com' } } as any);
      (mockRequest.json as jest.Mock).mockResolvedValue(updateData);
      mockPrisma.portfolio.findUnique.mockResolvedValue(null);

      const response = await updateById(mockRequest as NextRequest, mockParams);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Portfolio item not found');
    });
  });

  describe('DELETE /api/portfolio/[id]', () => {
    it('should delete portfolio item successfully when authenticated', async () => {
      mockGetServerSession.mockResolvedValue({ user: { email: 'admin@example.com' } } as any);
      mockPrisma.portfolio.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.portfolio.delete.mockResolvedValue({ id: 1 });

      const response = await deleteById(mockRequest as NextRequest, mockParams);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Portfolio item deleted successfully');
      expect(mockPrisma.portfolio.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return 401 when not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const response = await deleteById(mockRequest as NextRequest, mockParams);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 404 when portfolio item not found', async () => {
      mockGetServerSession.mockResolvedValue({ user: { email: 'admin@example.com' } } as any);
      mockPrisma.portfolio.findUnique.mockResolvedValue(null);

      const response = await deleteById(mockRequest as NextRequest, mockParams);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Portfolio item not found');
    });

    it('should handle database constraint errors', async () => {
      mockGetServerSession.mockResolvedValue({ user: { email: 'admin@example.com' } } as any);
      mockPrisma.portfolio.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.portfolio.delete.mockRejectedValue({ code: 'P2003' });

      const response = await deleteById(mockRequest as NextRequest, mockParams);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Cannot delete portfolio item due to existing references');
    });
  });
});