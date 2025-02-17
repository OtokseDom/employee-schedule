import { createBrowserRouter, Navigate } from "react-router-dom";
import "./index.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GuestLayout from "./components/GuestLayout";
import AdminLayout from "./components/AdminLayout";
import Products from "./pages/Products/Products";
import AddProduct from "./pages/Products/AddProduct";

const router = createBrowserRouter([
	{ path: "*", element: <NotFound /> },
	{
		path: "/",
		element: <AdminLayout />,
		children: [
			{ path: "/", element: <Navigate to="/dashboard" /> },
			{ path: "/dashboard", element: <Dashboard /> },
			{ path: "/users", element: <Users /> },
			{ path: "/products", element: <Products /> },
			{ path: "/products/add", element: <AddProduct /> },
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
