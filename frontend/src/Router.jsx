import { createBrowserRouter, Navigate } from "react-router-dom";
import "./index.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GuestLayout from "./components/GuestLayout";
import AdminLayout from "./components/AdminLayout";
import Schedules from "./pages/Schedules/Schedules";
import UserProfile from "./pages/Users/Show/index";
import Tasks from "./pages/Tasks/List/index";
import Users from "./pages/Users/List/index";
import Events from "./pages/Events/List/index";

const router = createBrowserRouter([
	{ path: "*", element: <NotFound /> },
	{
		path: "/",
		element: <AdminLayout />,
		children: [
			{ path: "/", element: <Navigate to="/schedule" /> },
			{ path: "/schedule", element: <Schedules /> },
			{ path: "/event", element: <Events /> },
			{ path: "/task", element: <Tasks /> },
			{ path: "/profile", element: <Users /> },
			{ path: "/profile/:slug", element: <UserProfile /> },
			// TODO: Add user master page
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
