import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UploadPage from './UploadPage';

// We mock the FileUpload component itself to simplify things
jest.mock('../components/FileUpload', () => ({ onUploadSuccess }) => (
  <button onClick={onUploadSuccess}>Simulate Success</button>
));

test('redirects to dashboard on successful upload', async () => {
  render(
    // We start at /upload
    <MemoryRouter initialEntries={['/upload']}>
      <Routes>
        <Route path="/upload" element={<UploadPage />} />
        {/* Make sure this path exactly matches what navigate() uses in your code */}
        <Route path="/" element={<div>Dashboard Page</div>} /> 
      </Routes>
    </MemoryRouter>
  );

  fireEvent.click(screen.getByText(/simulate success/i));

  // Use findByText for async navigation updates
  const dashboardText = await screen.findByText(/dashboard page/i);
  expect(dashboardText).toBeInTheDocument();
});
