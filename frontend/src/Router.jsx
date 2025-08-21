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
import Schedules from "./pages/Schedules";
import Categories from "./pages/Categories/List";
import Organization from "./pages/Organization";
import ErrorFallback from "./pages/ErrorFallback";
import Projects from "./pages/Projects/List";
import TaskStatuses from "./pages/TaskStatuses/List";

const router = createBrowserRouter(
	[
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
					path: "/tasks",
					element: (
						<ErrorFallback>
							<Tasks />
						</ErrorFallback>
					),
				},
				{
					path: "/projects",
					element: (
						<ErrorFallback>
							<Projects />
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
							path: "organization",
							element: (
								<ErrorFallback>
									<Organization />
								</ErrorFallback>
							),
						},
						{
							path: "categories",
							element: (
								<ErrorFallback>
									<Categories />
								</ErrorFallback>
							),
						},
						{
							path: "task-statuses",
							element: (
								<ErrorFallback>
									<TaskStatuses />
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
	],
	{
		future: {
			v7_startTransition: true,
		},
	}
);

export default router;
