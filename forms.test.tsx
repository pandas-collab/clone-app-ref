import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import ContactForm from '@/components/forms/ContactForm';
import JobApplicationForm from '@/components/forms/JobApplicationForm';
import JobForm from '@/components/forms/JobForm';
import PortfolioForm from '@/components/forms/PortfolioForm';
import ServiceForm from '@/components/forms/ServiceForm';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch as jest.MockedFunction<typeof fetch>;

// Mock file reader for image uploads
Object.defineProperty(window, 'FileReader', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    readAsDataURL: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    result: 'data:image/jpeg;base64,mockbase64string',
  })),
});

describe('ContactForm', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders all required fields', () => {
    render(<ContactForm />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/subject is required/i)).toBeInTheDocument();
    expect(screen.getByText(/message is required/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<ContactForm />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await user.type(screen.getByLabelText(/message/i), 'Test message content');
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          message: 'Test message content',
        }),
      });
    });
  });

  it('handles submission errors', async () => {
    const user = userEvent.setup();
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<ContactForm />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await user.type(screen.getByLabelText(/message/i), 'Test message content');
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/error sending message/i)).toBeInTheDocument();
    });
  });
});

describe('JobApplicationForm', () => {
  const mockJobId = '1';

  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders all required fields', () => {
    render(<JobApplicationForm jobId={mockJobId} />);
    
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cover letter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/resume/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit application/i })).toBeInTheDocument();
  });

  it('validates file upload', async () => {
    const user = userEvent.setup();
    render(<JobApplicationForm jobId={mockJobId} />);
    
    const fileInput = screen.getByLabelText(/resume/i);
    const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    await user.upload(fileInput, invalidFile);
    
    const submitButton = screen.getByRole('button', { name: /submit application/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/please upload a pdf file/i)).toBeInTheDocument();
  });

  it('submits application with valid data', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<JobApplicationForm jobId={mockJobId} />);
    
    await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(screen.getByLabelText(/phone/i), '+1234567890');
    await user.type(screen.getByLabelText(/cover letter/i), 'I am interested in this position...');
    
    const fileInput = screen.getByLabelText(/resume/i);
    const validFile = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
    await user.upload(fileInput, validFile);
    
    const submitButton = screen.getByRole('button', { name: /submit application/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(`/api/careers/${mockJobId}/applications`, expect.objectContaining({
        method: 'POST',
      }));
    });
  });
});

describe('JobForm', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders in create mode', () => {
    render(<JobForm />);
    
    expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/employment type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/requirements/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create job/i })).toBeInTheDocument();
  });

  it('renders in edit mode with initial data', () => {
    const initialData = {
      id: 1,
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'We are looking for a frontend developer...',
      requirements: 'React, TypeScript experience required',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(<JobForm initialData={initialData} />);
    
    expect(screen.getByDisplayValue('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Engineering')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update job/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<JobForm />);
    
    const submitButton = screen.getByRole('button', { name: /create job/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/job title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/department is required/i)).toBeInTheDocument();
    expect(screen.getByText(/location is required/i)).toBeInTheDocument();
    expect(screen.getByText(/description is required/i)).toBeInTheDocument();
  });

  it('creates new job successfully', async () => {
    const user = userEvent.setup();
    const mockOnSuccess = jest.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<JobForm onSuccess={mockOnSuccess} />);
    
    await user.type(screen.getByLabelText(/job title/i), 'Backend Developer');
    await user.type(screen.getByLabelText(/department/i), 'Engineering');
    await user.type(screen.getByLabelText(/location/i), 'New York');
    await user.selectOptions(screen.getByLabelText(/employment type/i), 'Full-time');
    await user.type(screen.getByLabelText(/description/i), 'Backend developer position...');
    await user.type(screen.getByLabelText(/requirements/i), 'Node.js, Express experience');
    
    const submitButton = screen.getByRole('button', { name: /create job/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/careers', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }));
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});

describe('PortfolioForm', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders all required fields', () => {
    render(<PortfolioForm />);
    
    expect(screen.getByLabelText(/project title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/slug/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/technologies/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/github url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/featured image/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create portfolio item/i })).toBeInTheDocument();
  });

  it('auto-generates slug from title', async () => {
    const user = userEvent.setup();
    render(<PortfolioForm />);
    
    const titleInput = screen.getByLabelText(/project title/i);
    const slugInput = screen.getByLabelText(/slug/i);
    
    await user.type(titleInput, 'My Amazing Project');
    
    await waitFor(() => {
      expect(slugInput).toHaveValue('my-amazing-project');
    });
  });

  it('validates URL format', async () => {
    const user = userEvent.setup();
    render(<PortfolioForm />);
    
    const urlInput = screen.getByLabelText(/project url/i);
    await user.type(urlInput, 'invalid-url');
    
    const submitButton = screen.getByRole('button', { name: /create portfolio item/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/please enter a valid url/i)).toBeInTheDocument();
  });

  it('handles image upload', async () => {
    const user = userEvent.setup();
    render(<PortfolioForm />);
    
    const fileInput = screen.getByLabelText(/featured image/i);
    const imageFile = new File(['image content'], 'project.jpg', { type: 'image/jpeg' });
    
    await user.upload(fileInput, imageFile);
    
    expect(fileInput.files?.[0]).toBe(imageFile);
  });

  it('submits portfolio item successfully', async () => {
    const user = userEvent.setup();
    const mockOnSuccess = jest.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<PortfolioForm onSuccess={mockOnSuccess} />);
    
    await user.type(screen.getByLabelText(/project title/i), 'E-commerce Platform');
    await user.type(screen.getByLabelText(/description/i), 'A modern e-commerce solution...');
    await user.type(screen.getByLabelText(/technologies/i), 'React, Node.js, MongoDB');
    await user.type(screen.getByLabelText(/project url/i), 'https://example.com');
    
    const submitButton = screen.getByRole('button', { name: /create portfolio item/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/portfolio', expect.objectContaining({
        method: 'POST',
      }));
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});

describe('ServiceForm', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renders all required fields', () => {
    render(<ServiceForm />);
    
    expect(screen.getByLabelText(/service name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/slug/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/short description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/features/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/service icon/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create service/i })).toBeInTheDocument();
  });

  it('validates price format', async () => {
    const user = userEvent.setup();
    render(<ServiceForm />);
    
    const priceInput = screen.getByLabelText(/price/i);
    await user.type(priceInput, 'invalid-price');
    
    const submitButton = screen.getByRole('button', { name: /create service/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/please enter a valid price/i)).toBeInTheDocument();
  });

  it('handles features as comma-separated list', async () => {
    const user = userEvent.setup();
    render(<ServiceForm />);
    
    const featuresInput = screen.getByLabelText(/features/i);
    await user.type(featuresInput, 'Feature 1, Feature 2, Feature 3');
    
    expect(featuresInput).toHaveValue('Feature 1, Feature 2, Feature 3');
  });

  it('submits service successfully', async () => {
    const user = userEvent.setup();
    const mockOnSuccess = jest.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<ServiceForm onSuccess={mockOnSuccess} />);
    
    await user.type(screen.getByLabelText(/service name/i), 'Web Development');
    await user.type(screen.getByLabelText(/short description/i), 'Professional web development services');
    await user.type(screen.getByLabelText(/full description/i), 'We provide comprehensive web development...');
    await user.type(screen.getByLabelText(/features/i), 'Responsive Design, SEO Optimized, Fast Loading');
    await user.type(screen.getByLabelText(/price/i), '2500');
    
    const submitButton = screen.getByRole('button', { name: /create service/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/services', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }));
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('updates existing service', async () => {
    const user = userEvent.setup();
    const initialData = {
      id: 1,
      name: 'Existing Service',
      slug: 'existing-service',
      description: 'Short description',
      longDescription: 'Long description',
      features: ['Feature 1', 'Feature 2'],
      price: 1000,
      icon: 'icon.svg',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(<ServiceForm initialData={initialData} />);
    
    const nameInput = screen.getByDisplayValue('Existing Service');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Service');
    
    const submitButton = screen.getByRole('button', { name: /update service/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/services/1', expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      }));
    });
  });
});