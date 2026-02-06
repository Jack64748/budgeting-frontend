import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FileUpload from './FileUpload';

// 1. Mock the global fetch so we don't hit your real C# backend during tests
global.fetch = jest.fn();

describe('FileUpload Component', () => {
  
  // Clear mocks before each test to prevent data leaking between tests
  beforeEach(() => {
    fetch.mockClear();
  });

  test('displays error message and stops loading when backend returns 400', async () => {
    // 1. ARRANGE
    // Simulate a 400 Bad Request response from your .NET API
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: "The conversion cannot be performed. Date format invalid." }),
    });

    render(<FileUpload />);

    // Create a fake file to "upload"
    const file = new File(['test content'], 'test.csv', { type: 'text/csv' });
    
    // Find the hidden input by its associated label text
    const input = screen.getByLabelText(/Click to Upload CSV/i);

    // 2. ACT
    // Simulate the user selecting a file
    fireEvent.change(input, { target: { files: [file] } });

    // 3. ASSERT
    // Wait for the async fetch to finish and the error message to appear in the UI
    await waitFor(() => {
      expect(screen.getByText(/The conversion cannot be performed/i)).toBeInTheDocument();
    });

    // Verify the "Processing..." spinner text is gone (proving the 'finally' block worked)
    expect(screen.queryByText(/Processing Statement.../i)).not.toBeInTheDocument();
    
    // Verify the "Click to Upload" text has returned
    expect(screen.getByText(/Click to Upload CSV/i)).toBeInTheDocument();
  });

  test('calls onUploadSuccess when backend returns 200 OK', async () => {
    // Arrange
    const mockOnUploadSuccess = jest.fn();
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ message: "Success" }),
    });

    render(<FileUpload onUploadSuccess={mockOnUploadSuccess} />);

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText(/Click to Upload CSV/i);

    // Act
    fireEvent.change(input, { target: { files: [file] } });

    // Assert
    await waitFor(() => {
      expect(mockOnUploadSuccess).toHaveBeenCalled();
    });
  });
});
