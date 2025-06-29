import { createBrowserRouter, Navigate } from "react-router-dom";
import "./index.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GuestLayout from "./components/GuestLayout";
import AdminLayout from "./components/AdminLayout";
import UserProfile from "./pages/Users/Show/index";
import Tasks from "./pages/Tasks/List/index";
import Users from "./pages/Users/List/index";
import Events from "./pages/Events/List/index";
import Schedules from "./pages/Schedules";
import Categories from "./pages/Categories/List";

const router = createBrowserRouter([
	{ path: "*", element: <NotFound /> },
	{
		path: "/",
		element: <AdminLayout />,
		children: [
			{ path: "/", element: <Navigate to="/calendar" /> },
			{ path: "/calendar", element: <Schedules /> },
			{ path: "/task", element: <Tasks /> },
			{ path: "/users", element: <Users /> },
			{ path: "/profile/:id", element: <UserProfile /> },
			{
				path: "/settings",
				children: [{ path: "categories", element: <Categories /> }],
			},
			{ path: "", element: <Users /> },
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
