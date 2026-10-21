import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { DataProvider } from '../context/DataContext';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../components/common/Toast';
import { HomePage } from '../pages/public/HomePage';
import { AboutPage } from '../pages/public/AboutPage';
import { ContactPage } from '../pages/public/ContactPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <ToastProvider>{ui}</ToastProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('VoltNex Route Views & Form Validation Tests', () => {
  it('renders HomePage hero with brand identity and core CTAs', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByText(/Build Something/i)).toBeInTheDocument();
    expect(screen.getByText('Explore Blueprints')).toBeInTheDocument();
    expect(screen.getByText('Browse Tutorials')).toBeInTheDocument();
  });

  it('renders AboutPage with founder Pradeep information and manifesto', () => {
    renderWithProviders(<AboutPage />);
    expect(screen.getByText('About VoltNex Labs')).toBeInTheDocument();
    expect(screen.getByText(/Why VoltNex Labs Was Founded/i)).toBeInTheDocument();
  });

  it('renders ContactPage and flags validation errors on empty submission', async () => {
    renderWithProviders(<ContactPage />);
    expect(screen.getByText('Get in Touch')).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /Send Message/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('Your name is required.')).toBeInTheDocument();
      expect(screen.getByText('Email address is required.')).toBeInTheDocument();
    });
  });

  it('renders NotFoundPage with circuit disconnect visual and navigation button', () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.getByText('Circuit Trace Disconnected')).toBeInTheDocument();
    expect(screen.getByText('Return Home')).toBeInTheDocument();
  });
});
