import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthenticationForm } from './components/AuthenticationForm/AuthenticationForm';
import { HomePage } from './pages/Home.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthenticationForm />,
  },
  {
    path: '/home',
    element: <HomePage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
