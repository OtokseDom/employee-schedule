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
			{ path: "/", element: <Navigate to="/dashboard" /> },
			{
				path: "/dashboard",
				element: (
					<ErrorFallback>
						<Dashboard />
					</ErrorFallback>
				),
			},
			{
				path: "/calendar",
				element: (
					<ErrorFallback>
						<Schedules />
					</ErrorFallback>
				),
			},
			{
				path: "/task",
				element: (
					<ErrorFallback>
						<Tasks />
					</ErrorFallback>
				),
			},
			{
				path: "/users",
				element: (
					<ErrorFallback>
						<Users />
					</ErrorFallback>
				),
			},
			{
				path: "/users/:id",
				element: (
					<ErrorFallback>
						<UserProfile />
					</ErrorFallback>
				),
			},
			{
				path: "/settings",
				children: [
					{
						path: "categories",
						element: (
							<ErrorFallback>
								<Categories />
							</ErrorFallback>
						),
					},
					{
						path: "organization",
						element: (
							<ErrorFallback>
								<Organization />
							</ErrorFallback>
						),
					},
				],
			},
		],
	},
	{
		path: "/",
		element: <GuestLayout />,
		children: [
			{
				path: "/login",
				element: (
					<ErrorFallback>
						<Login />
					</ErrorFallback>
				),
			},
			{
				path: "/signup",
				element: (
					<ErrorFallback>
						<Signup />
					</ErrorFallback>
				),
			},
		],
	},
]);

export default router;
