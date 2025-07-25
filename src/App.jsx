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
import ManagexAdvancedPackage from "./pages/management-advancedPackage";
import PageProListPage from "./pages/package-pro-list-pages";
import MembersInWorkSpace from "./pages/member-in-workSpace";
import TransactionHistory from "./pages/transaction-history";
import OwnDashboard from "./pages/user/layout_dashboardOwn/user-dashboard";
import ChatBox from "./pages/chatboxAI/chatbotform";

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

          {
          path: "PageProListPage",
          element: <PageProListPage />,
        },
         {
          path: "MembersInWorkSpace/:id",
          element: <MembersInWorkSpace />,
        },

         {
          path: "transaction-history",
          element: <TransactionHistory />,
        },
      ],
    },
 {
          path: "/chat-box",
          element: <ChatBox/>
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
          path: "manage-advancedPackage",
          element: <ManagexAdvancedPackage />,
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
    {
      path: "/own-dashboard",
      element: <OwnDashboard/>
    }

  ]);
  return (
    <div>
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
};

export default App;
