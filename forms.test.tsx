import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../components/forms/ContactForm';
import ServiceForm from '../components/forms/ServiceForm';
import PortfolioForm from '../components/forms/PortfolioForm';
import CareerForm from '../components/forms/CareerForm';
import JobApplicationForm from '../components/forms/JobApplicationForm';

const mockSession = {
  user: {
    id: '1',
    email: 'admin@test.com',
    name: 'Admin User',
    role: 'admin',
  },
  expires: '2024-12-31T23:59:59.999Z',
};

const renderWithSession = (component: React.ReactElement, session = mockSession) => {
  return render(
    <SessionProvider session={session}>
      {component}
    </SessionProvider>
  );
};

// Mock fetch globally
global.fetch = jest.fn();

describe('ContactForm', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders contact form with all required fields', () => {
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

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/subject is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'invalid-email');

    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await user.type(screen.getByLabelText(/message/i), 'Test message content');

    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
    await user.type(screen.getByLabelText(/message/i), 'Test message content');

    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
    });
  });
});

describe('ServiceForm', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders service form with all required fields', () => {
    renderWithSession(<ServiceForm />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create service/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    renderWithSession(<ServiceForm />);

    const submitButton = screen.getByRole('button', { name: /create service/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/price is required/i)).toBeInTheDocument();
    });
  });

  it('validates price format', async () => {
    const user = userEvent.setup();
    renderWithSession(<ServiceForm />);

    const priceInput = screen.getByLabelText(/price/i);
    await user.type(priceInput, 'invalid-price');

    const submitButton = screen.getByRole('button', { name: /create service/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/price must be a valid number/i)).toBeInTheDocument();
    });
  });

  it('submits service form with valid data', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', title: 'Test Service' }),
    });

    renderWithSession(<ServiceForm />);

    await user.type(screen.getByLabelText(/title/i), 'Test Service');
    await user.type(screen.getByLabelText(/description/i), 'Test description');
    await user.type(screen.getByLabelText(/price/i), '100');
    await user.selectOptions(screen.getByLabelText(/category/i), 'web-development');

    const submitButton = screen.getByRole('button', { name: /create service/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Service',
          description: 'Test description',
          price: 100,
          category: 'web-development',
        }),
      });
    });
  });
});

describe('PortfolioForm', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders portfolio form with all required fields', () => {
    renderWithSession(<PortfolioForm />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/image url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/technologies/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create project/i })).toBeInTheDocument();
  });

  it('validates URL formats', async () => {
    const user = userEvent.setup();
    renderWithSession(<PortfolioForm />);

    await user.type(screen.getByLabelText(/image url/i), 'invalid-url');
    await user.type(screen.getByLabelText(/project url/i), 'invalid-url');

    const submitButton = screen.getByRole('button', { name: /create project/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid image url/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid project url/i)).toBeInTheDocument();
    });
  });

  it('handles multiple technologies input', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', title: 'Test Project' }),
    });

    renderWithSession(<PortfolioForm />);

    await user.type(screen.getByLabelText(/title/i), 'Test Project');
    await user.type(screen.getByLabelText(/description/i), 'Test description');
    await user.type(screen.getByLabelText(/image url/i), 'https://example.com/image.jpg');
    await user.type(screen.getByLabelText(/project url/i), 'https://example.com');
    await user.type(screen.getByLabelText(/technologies/i), 'React, TypeScript, Next.js');

    const submitButton = screen.getByRole('button', { name: /create project/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/portfolio', expect.objectContaining({
        body: expect.stringContaining('React, TypeScript, Next.js'),
      }));
    });
  });
});

describe('CareerForm', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders career form with all required fields', () => {
    renderWithSession(<CareerForm />);

    expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/requirements/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/employment type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/salary range/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create job/i })).toBeInTheDocument();
  });

  it('validates salary range format', async () => {
    const user = userEvent.setup();
    renderWithSession(<CareerForm />);

    await user.type(screen.getByLabelText(/salary range/i), 'invalid-salary');

    const submitButton = screen.getByRole('button', { name: /create job/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid salary range format/i)).toBeInTheDocument();
    });
  });

  it('handles requirements as textarea', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', title: 'Test Job' }),
    });

    renderWithSession(<CareerForm />);

    const requirements = 'Bachelor\'s degree\nExperience with React\nGood communication skills';
    await user.type(screen.getByLabelText(/requirements/i), requirements);

    expect(screen.getByDisplayValue(requirements)).toBeInTheDocument();
  });
});

describe('JobApplicationForm', () => {
  const jobId = '1';

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders job application form with all required fields', () => {
    render(<JobApplicationForm jobId={jobId} />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/resume/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cover letter/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit application/i })).toBeInTheDocument();
  });

  it('validates phone number format', async () => {
    const user = userEvent.setup();
    render(<JobApplicationForm jobId={jobId} />);

    await user.type(screen.getByLabelText(/phone/i), '123');

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid phone number format/i)).toBeInTheDocument();
    });
  });

  it('validates file upload', async () => {
    const user = userEvent.setup();
    render(<JobApplicationForm jobId={jobId} />);

    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    const resumeInput = screen.getByLabelText(/resume/i) as HTMLInputElement;

    await user.upload(resumeInput, file);

    await waitFor(() => {
      expect(screen.getByText(/only pdf files are allowed/i)).toBeInTheDocument();
    });
  });

  it('accepts valid PDF file', async () => {
    const user = userEvent.setup();
    render(<JobApplicationForm jobId={jobId} />);

    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
    const resumeInput = screen.getByLabelText(/resume/i) as HTMLInputElement;

    await user.upload(resumeInput, file);

    expect(resumeInput.files?.[0]).toBe(file);
    expect(resumeInput.files).toHaveLength(1);
  });

  it('submits application with all required data', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', status: 'submitted' }),
    });

    render(<JobApplicationForm jobId={jobId} />);

    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone/i), '+1-555-123-4567');
    await user.upload(screen.getByLabelText(/resume/i), file);
    await user.type(screen.getByLabelText(/cover letter/i), 'I am interested in this position...');

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`/api/careers/${jobId}/applications`, expect.objectContaining({
        method: 'POST',
      }));
    });
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    render(<JobApplicationForm jobId={jobId} />);

    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });

    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone/i), '+1-555-123-4567');
    await user.upload(screen.getByLabelText(/resume/i), file);

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    await user.click(submitButton);

    expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();
  });
});

describe('Form Error Handling', () => {
  it('displays network error messages', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Test');
    await user.type(screen.getByLabelText(/message/i), 'Test message');

    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
    });
  });

  it('displays server error messages', async () => {
    const user = userEvent.setup();
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Validation failed' }),
    });

    renderWithSession(<ServiceForm />);

    await user.type(screen.getByLabelText(/title/i), 'Test Service');
    await user.type(screen.getByLabelText(/description/i), 'Test description');
    await user.type(screen.getByLabelText(/price/i), '100');

    await user.click(screen.getByRole('button', { name: /create service/i }));

    await waitFor(() => {
      expect(screen.getByText(/validation failed/i)).toBeInTheDocument();
    });
  });
});