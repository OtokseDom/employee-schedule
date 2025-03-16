import { createBrowserRouter, Navigate } from "react-router-dom";
import "./index.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GuestLayout from "./components/GuestLayout";
import AdminLayout from "./components/AdminLayout";
import Schedules from "./pages/Schedules/Schedules";
import Task from "./pages/Tasks/Task";

const router = createBrowserRouter([
	{ path: "*", element: <NotFound /> },
	{
		path: "/",
		element: <AdminLayout />,
		children: [
			{ path: "/", element: <Navigate to="/schedule" /> },
			{ path: "/dashboard", element: <Dashboard /> },
			{ path: "/schedule", element: <Schedules /> },
			{ path: "/task", element: <Task /> },
		],
	},
	{
		path: "/",
		element: <GuestLayout />,
		children: [
			{ path: "/login", element: <Login /> },
			{ path: "/signup", element: <Signup /> },
		],
	},
]);

export default router;
