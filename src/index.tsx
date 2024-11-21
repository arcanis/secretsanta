import './index.css';
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from './pages/Home';
import { Pairing } from './pages/Pairing';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/pairing",
    element: <Pairing />,
  },
]);

const root = createRoot(document.getElementById("root")!);
root.render(
  <RouterProvider router={router} />
); 