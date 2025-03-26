import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthenticationForm } from './components/AuthenticationForm/AuthenticationForm';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { HomePage } from './pages/Home.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthenticationForm />,
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
