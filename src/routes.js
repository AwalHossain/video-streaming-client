import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "./layouts/dashboard";
import SimpleLayout from "./layouts/simple";
//
import ProtectedRoute from "./components/ProtectedRoute";
import PageLayout from "./layouts/page/PageLayout";
import BlogPage from "./pages/BlogPage";
import DashboardAppPage from "./pages/DashboardAppPage";
import LoginPage from "./pages/LoginPage";
import Page404 from "./pages/Page404";
import ProductsPage from "./pages/ProductsPage";
import SignupPage from "./pages/SignupPage";
import UserPage from "./pages/UserPage";
import VideoPlayerPage from "./pages/VideoPlayerPage";
import VideoUploadPage from "./pages/VideoUploadPage";

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: "app", element: <DashboardAppPage /> },
        { path: "user", element: <UserPage /> },
        { path: "products", element: <ProductsPage /> },
        { path: "blog", element: <ProtectedRoute><BlogPage /> </ProtectedRoute> },
        { path: "video-upload", element: <VideoUploadPage /> },
      ],
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <SignupPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    {
      element: <PageLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        {
          path: "/watch/:videoId",
          element: <VideoPlayerPage />
        },
      ]
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
