import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path:"/admin",
      element: <Dashboard />
    }
  ]);

  return (
  <>
    <RouterProvider router={router} />
  </>
  );
}

export default App;
