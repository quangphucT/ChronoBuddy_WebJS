import { createBrowserRouter, RouterProvider } from "react-router-dom";

import DashboardPage from "./pages/dashboard-management/dashboard";
import StatisticsManagement from "./pages/dashboard-management/admin/statistics";
import LoginPage from "./pages/authen/login";
import RegisterPage from "./pages/authen/register";

import HomePageIntro from "./pages/home-page-intro";
import HomePageLetStart from "./pages/home-page-let-start";
import ForgotPasswordPage from "./pages/authen/forgot-account-page";
import ResetPasswordPage from "./pages/authen/reset-password-page";
import HomePage from "./pages/main-home-page";
import Layout from "./components/layout";
import ProfilePage from "./pages/profile-user-page";
import AddProjectTask from "./pages/add-project-task-page";
import { ToastContainer } from "react-toastify";
import PublicRoute from "./pages/protect-route";
import PrivateRoute from "./pages/private-route";
import UserManagement from "./pages/dashboard-management/admin/user-management";
import UserDeleteManagement from "./pages/dashboard-management/admin/user-delete-management";
import TaskDetailsWorkSpace from "./pages/task-details_WorkSpace";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/home",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <HomePage />,
        },
        {
          path: "profile-page",
          element: <ProfilePage />,
        },
        {
          path: "add-projects-tasks",
          element: <AddProjectTask />,
        },
          {
          path: "tasks-details/:id",
          element: <TaskDetailsWorkSpace />,
        },
      ],
    },

    {
      path: "/",
      element: (
        <PublicRoute>
          <HomePageIntro />
        </PublicRoute>
      ),
    },
    {
      path: "/home-page-lets-start",
      element: <HomePageLetStart />,
    },
    {
      path: "forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "reset-password",
      element: <ResetPasswordPage />,
    },
    {
      path: "/login-page",
      element: <LoginPage />,
    },
    {
      path: "/register-page",
      element: <RegisterPage />,
    },
    {
      path: "/dashboard",
      element: (
        <PrivateRoute>
          <DashboardPage />,
        </PrivateRoute>
      ),
      children: [
        {
          path: "statistic",
          element: <StatisticsManagement />,
        },
         {
          path: "user-management",
          element: <UserManagement />,
        },
          {
          path: "user-delete-management",
          element: <UserDeleteManagement />,
        },
      ],
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
};

export default App;
