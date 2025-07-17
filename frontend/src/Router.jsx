import { createBrowserRouter, Navigate } from "react-router-dom";
import "./index.css";
import Dashboard from "./pages/Dashboard";
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
import Organization from "./pages/Organization";
import ErrorFallback from "./pages/ErrorFallback";

const router = createBrowserRouter([
	{ path: "*", element: <NotFound /> },
	{
		path: "/",
		element: <AdminLayout />,
		children: [
			{ path: "/", element: <Navigate to="/dashboard" />, errorElement: <ErrorFallback /> },
			{ path: "/dashboard", element: <Dashboard />, errorElement: <ErrorFallback /> },
			{ path: "/calendar", element: <Schedules />, errorElement: <ErrorFallback /> },
			{ path: "/task", element: <Tasks />, errorElement: <ErrorFallback /> },
			{ path: "/users", element: <Users />, errorElement: <ErrorFallback /> },
			{ path: "/users/:id", element: <UserProfile />, errorElement: <ErrorFallback /> },
			{
				path: "/settings",
				children: [
					{ path: "categories", element: <Categories />, errorElement: <ErrorFallback /> },
					{ path: "organization", element: <Organization />, errorElement: <ErrorFallback /> },
				],
			},
		],
	},
	{
		path: "/",
		element: <GuestLayout />,
		children: [
			{ path: "/login", element: <Login />, errorElement: <ErrorFallback /> },
			{ path: "/signup", element: <Signup />, errorElement: <ErrorFallback /> },
		],
	},
]);

export default router;
