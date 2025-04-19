import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import First from "./layouts/first/First";
import Home from "./pages/home/Home";
import AdminLogin from "./pages/ADMIN/adminLogin/AdminLogin";
import VerifyEmail from "./pages/verifyEmail/VerifyEmail";
import NotFound from "./pages/notFound/NotFound";
import ProtectedUserRoute from "./routes/ProtectedUserRoute";
import UserLayout from "./layouts/userLayout/UserLayout";
import UserDashBoard from "./pages/userDash/UserDashBoard";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import AdminDashboard from "./pages/ADMIN/adminDash/AdminDashboard";
import AuthProvider from "./context/AuthContext";
import "./App.css";
import AdminLayout from "./layouts/adminlayout/AdminLayout";
import Register from "./pages/register/Register";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import RequestResetPassword from "./pages/requestResetPass/RequestResetPassword";
import { SnackbarProvider } from "notistack";
import AdminProvider from "./context/AdminContext";
import ExtensionRequests from "./pages/ADMIN/extensionRequests/ExtensionRequests";
import Users from "./pages/ADMIN/users/Users";
import CreateTasks from "./pages/ADMIN/createTasks/CreateTasks";
import AssignedTasks from "./pages/ADMIN/assignedTasks/AssignedTasks";
import AllTasks from "./pages/ADMIN/allTasks/AllTasks";
import TaskDetails from "./pages/taskDetails/TaskDetails";
import { Meetings } from "./pages/ADMIN/meetings/Meetings";
const router = createBrowserRouter([
  {
    path: "/",
    element: <First />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/adminLogin",
        element: <AdminLogin />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "/requestResetPassword",
        element: <RequestResetPassword />,
      },
      {
        path: "/register-user",
        element: <Register />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "/user",
        element: (
          <ProtectedUserRoute>
            <UserLayout />
          </ProtectedUserRoute>
        ),
        children: [
          { path: "/user", element: <UserDashBoard /> },
          { path: "task/:taskId", element: <TaskDetails /> }, 
        ],
      },
      {
        path: "/admin",
        element: (
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        ),
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "extensionRequests", element: <ExtensionRequests /> },
          { path: "meetings", element: <Meetings /> },
          { path: "users", element: <Users /> },
          { path: "createTask", element: <CreateTasks /> },
          { path: "assignedTasks", element: <AssignedTasks /> },
          { path: "allTasks", element: <AllTasks /> },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <AdminProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </AdminProvider>
    </SnackbarProvider>
  );
};

export default App;
