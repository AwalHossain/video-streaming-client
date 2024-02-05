import { Navigate, useRoutes } from "react-router-dom";
// layouts
import DashboardLayout from "./layouts/dashboard";
import SimpleLayout from "./layouts/simple";
//
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import PageLayout from "./layouts/page/PageLayout";
import DashboardAppPage from "./pages/DashboardAppPage";
import LoginPage from "./pages/LoginPage";
import Page404 from "./pages/Page404";
import SignupPage from "./pages/SignupPage";
import ContentPage from "./pages/UserPage";
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
        { path: "content", element: <ContentPage /> },
        // { path: "products", element: <ProductsPage /> },
        // { path: "blog", element: <ProtectedRoute><BlogPage /> </ProtectedRoute> },
        {
          path: "video-upload", element: <ProtectedRoute> <VideoUploadPage /> </ProtectedRoute>
        },
      ],
    },
    {
      path: "login",
      element: <PublicRoute> <LoginPage /></PublicRoute>,
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
    // {
    //   path: "*",
    //   element: <Navigate to="/404" replace />,
    // },
  ]);

  return routes;
}
