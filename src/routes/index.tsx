import { createBrowserRouter, Navigate } from 'react-router-dom';

import AppLayout from '@/app/AppLayout';
import RouteErrorBoundary from '@/app/RouteErrorBoundary';
import OnboardingPage from '@/pages/onboarding';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <OnboardingPage /> },
      { path: '*', element: <Navigate to="/" replace /> }, //To let the user go back to homepage
    ],
  },
]);
