import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import { Button, Modal, Card, Toast, LoadingSpinner, Badge, Dropdown, Tabs, Pagination, ErrorBoundary, Header, Footer, Navigation } from './ui';

// Mock session provider for components that need authentication context
const MockSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div data-testid="mock-session">{children}</div>;
};

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes', () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('button-spinner')).toBeInTheDocument();
  });
});

describe('Modal Component', () => {
  it('renders when open', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <div>Modal content</div>
      </Modal>
    );
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={jest.fn()}>
        <div>Modal content</div>
      </Modal>
    );
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal content</div>
      </Modal>
    );
    
    fireEvent.click(screen.getByLabelText('Close'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking backdrop', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>Modal content</div>
      </Modal>
    );
    
    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('prevents backdrop close when closeOnBackdropClick is false', () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnBackdropClick={false}>
        <div>Modal content</div>
      </Modal>
    );
    
    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(handleClose).not.toHaveBeenCalled();
  });
});

describe('Card Component', () => {
  it('renders card with content', () => {
    render(
      <Card>
        <Card.Header>Header</Card.Header>
        <Card.Body>Body content</Card.Body>
        <Card.Footer>Footer</Card.Footer>
      </Card>
    );

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Body content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('applies hover effect when hover prop is true', () => {
    render(<Card hover>Hoverable card</Card>);
    expect(screen.getByTestId('card')).toHaveClass('card-hover');
  });

  it('renders as clickable when onClick provided', () => {
    const handleClick = jest.fn();
    render(<Card onClick={handleClick}>Clickable card</Card>);
    
    fireEvent.click(screen.getByTestId('card'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('Toast Component', () => {
  it('renders toast with message', () => {
    render(<Toast message="Test message" type="info" />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('applies correct type classes', () => {
    render(<Toast message="Success message" type="success" />);
    expect(screen.getByTestId('toast')).toHaveClass('toast-success');
  });

  it('auto dismisses after duration', async () => {
    const handleDismiss = jest.fn();
    render(
      <Toast 
        message="Auto dismiss" 
        type="info" 
        autoHide={true}
        duration={1000}
        onDismiss={handleDismiss}
      />
    );

    await waitFor(() => {
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    }, { timeout: 1500 });
  });

  it('can be manually dismissed', () => {
    const handleDismiss = jest.fn();
    render(
      <Toast 
        message="Manual dismiss" 
        type="warning" 
        onDismiss={handleDismiss}
      />
    );

    fireEvent.click(screen.getByLabelText('Dismiss'));
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });
});

describe('LoadingSpinner Component', () => {
  it('renders spinner with default size', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders with custom size', () => {
    render(<LoadingSpinner size="large" />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('spinner-lg');
  });

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Loading data..." />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders overlay variant', () => {
    render(<LoadingSpinner overlay={true} />);
    expect(screen.getByTestId('spinner-overlay')).toBeInTheDocument();
  });
});

describe('Badge Component', () => {
  it('renders badge with text', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    render(<Badge variant="success">Success</Badge>);
    expect(screen.getByTestId('badge')).toHaveClass('badge-success');
  });

  it('renders with count', () => {
    render(<Badge count={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders dot variant', () => {
    render(<Badge dot={true} />);
    expect(screen.getByTestId('badge')).toHaveClass('badge-dot');
  });
});

describe('Dropdown Component', () => {
  const mockItems = [
    { id: '1', label: 'Option 1', value: 'opt1' },
    { id: '2', label: 'Option 2', value: 'opt2' },
    { id: '3', label: 'Option 3', value: 'opt3' },
  ];

  it('renders dropdown trigger', () => {
    render(<Dropdown items={mockItems} trigger="Select Option" />);
    expect(screen.getByText('Select Option')).toBeInTheDocument();
  });

  it('shows dropdown items when clicked', () => {
    render(<Dropdown items={mockItems} trigger="Select Option" />);
    
    fireEvent.click(screen.getByText('Select Option'));
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('selects item on click', () => {
    const handleSelect = jest.fn();
    render(
      <Dropdown 
        items={mockItems} 
        trigger="Select Option"
        onSelect={handleSelect}
      />
    );

    fireEvent.click(screen.getByText('Select Option'));
    fireEvent.click(screen.getByText('Option 2'));

    expect(handleSelect).toHaveBeenCalledWith(mockItems[1]);
  });

  it('closes dropdown when clicking outside', () => {
    render(<Dropdown items={mockItems} trigger="Select Option" />);
    
    fireEvent.click(screen.getByText('Select Option'));
    expect(screen.getByText('Option 1')).toBeInTheDocument();

    fireEvent.click(document.body);
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });
});

describe('Tabs Component', () => {
  const mockTabs = [
    { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
    { id: 'tab2', label: 'Tab 2', content: 'Content 2' },
    { id: 'tab3', label: 'Tab 3', content: 'Content 3' },
  ];

  it('renders all tab labels', () => {
    render(<Tabs tabs={mockTabs} />);
    
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('shows first tab content by default', () => {
    render(<Tabs tabs={mockTabs} />);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  it('switches content when tab clicked', () => {
    render(<Tabs tabs={mockTabs} />);
    
    fireEvent.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
  });

  it('applies active class to selected tab', () => {
    render(<Tabs tabs={mockTabs} />);
    
    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    expect(tab1).toHaveClass('active');

    fireEvent.click(screen.getByText('Tab 2'));
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    expect(tab2).toHaveClass('active');
    expect(tab1).not.toHaveClass('active');
  });

  it('calls onChange when tab switches', () => {
    const handleChange = jest.fn();
    render(<Tabs tabs={mockTabs} onChange={handleChange} />);
    
    fireEvent.click(screen.getByText('Tab 2'));
    expect(handleChange).toHaveBeenCalledWith('tab2');
  });
});

describe('Pagination Component', () => {
  it('renders pagination controls', () => {
    render(
      <Pagination 
        currentPage={1}
        totalPages={5}
        onPageChange={() => {}}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(
      <Pagination 
        currentPage={1}
        totalPages={5}
        onPageChange={() => {}}
      />
    );

    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <Pagination 
        currentPage={5}
        totalPages={5}
        onPageChange={() => {}}
      />
    );

    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('calls onPageChange when page clicked', () => {
    const handlePageChange = jest.fn();
    render(
      <Pagination 
        currentPage={1}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );

    fireEvent.click(screen.getByText('3'));
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it('shows ellipsis for large page counts', () => {
    render(
      <Pagination 
        currentPage={5}
        totalPages={20}
        onPageChange={() => {}}
      />
    );

    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('displays correct page info', () => {
    render(
      <Pagination 
        currentPage={2}
        totalPages={5}
        totalItems={50}
        itemsPerPage={10}
        onPageChange={() => {}}
        showInfo={true}
      />
    );

    expect(screen.getByText(/Showing 11-20 of 50 items/)).toBeInTheDocument();
  });
});

describe('ErrorBoundary Component', () => {
  const ThrowError: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
    if (shouldThrow) {
      throw new Error('Test error');
    }
    return <div>No error</div>;
  };

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('renders custom error message when provided', () => {
    render(
      <ErrorBoundary fallback={<div>Custom error message</div>}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('includes retry button in error UI', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/try again/i)).toBeInTheDocument();
  });

  it('recovers from error when retry is clicked', async () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/try again/i));

    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    await waitFor(() => {
      expect(screen.getByText('No error')).toBeInTheDocument();
    });
  });
});

// Integration tests for UI component interactions
describe('UI Components Integration', () => {
  it('modal with form and buttons works together', () => {
    const handleSubmit = jest.fn();
    const handleClose = jest.fn();

    render(
      <Modal isOpen={true} onClose={handleClose}>
        <Modal.Header>Create Item</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Item name" />
            <div className="modal-actions">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    );

    expect(screen.getByPlaceholderText('Item name')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(handleClose).toHaveBeenCalled();
  });

  it('card with dropdown and badges renders correctly', () => {
    const dropdownItems = [
      { id: '1', label: 'Edit', value: 'edit' },
      { id: '2', label: 'Delete', value: 'delete' },
    ];

    render(
      <Card>
        <Card.Header>
          <div className="flex justify-between items-center">
            <h3>Item Title</h3>
            <div className="flex items-center gap-2">
              <Badge variant="success">Active</Badge>
              <Dropdown items={dropdownItems} trigger="⋮" />
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <p>Item description goes here</p>
        </Card.Body>
      </Card>
    );

    expect(screen.getByText('Item Title')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Item description goes here')).toBeInTheDocument();
  });
});

describe('Accessibility Tests', () => {
  it('header has proper landmarks', () => {
    render(
      <MockSessionProvider>
        <Header />
      </MockSessionProvider>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('footer has proper landmarks', () => {
    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('navigation has proper ARIA labels', () => {
    render(
      <MockSessionProvider>
        <Navigation />
      </MockSessionProvider>
    );

    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main navigation');
  });

  it('modal has proper ARIA attributes', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
        Content
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
  });

  it('buttons have proper labels', () => {
    render(<Button>Test Button</Button>);

    expect(screen.getByRole('button')).toHaveAccessibleName('Test Button');
  });
});

describe('Responsive Design Tests', () => {
  beforeEach(() => {
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('header adapts to mobile viewport', () => {
    // Mock mobile viewport
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(max-width: 768px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(
      <MockSessionProvider>
        <Header />
      </MockSessionProvider>
    );

    expect(screen.getByLabelText('Toggle mobile menu')).toBeInTheDocument();
  });

  it('navigation collapses on mobile', () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(max-width: 768px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(
      <MockSessionProvider>
        <Navigation />
      </MockSessionProvider>
    );

    expect(screen.getByRole('navigation')).toHaveClass('mobile-collapsed');
  });
});
