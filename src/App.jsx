import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Home from "./pages/Home";
import BookDetail from "./pages/BookDetails";
import AuthorDetail from "./pages/AuthorDetails";
import Mualliflar from "./pages/Mualliflar";
import ProtectedRoutes from "./layout/ProtectedRoutes";
import RootLayouts from "./layout/RootLayouts";
import Login from "./pages/Login";
import { useAppStore } from "./lib/zustand";

function App() {
  const admin = useAppStore((state) => state.admin);
  const routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoutes admin={admin}>
          <RootLayouts />
        </ProtectedRoutes>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/authors",
          element: <Mualliflar />,
        },
        {
          path: "/book/:id",
          element: <BookDetail />,
        },
        {
          path: "/author/:id",
          element: <AuthorDetail />,
        },
      ],
    },
    {
      path: "/login",
      element: admin ? <Navigate to={"/"} /> : <Login />,
    },
  ]);

  return <RouterProvider router={routes} />;
}

export default App;
