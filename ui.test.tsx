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