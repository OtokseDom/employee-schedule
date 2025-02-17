import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuthContext } from "../contexts/AuthContextProvider";
import axiosClient from "../axios.client";
import { useSidebarContext } from "@/contexts/SidebarContextProvider";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
// import { cookies } from "next/headers";

export default function AdminLayout() {
	const { user, token, setToken, setUser } = useAuthContext();
	const { expanded } = useSidebarContext();
	// Login Authentication
	if (!token || !user) {
		return <Navigate to={"/login"} />;
	}

	useEffect(() => {
		axiosClient.get("/user").then(({ data }) => {
			setUser(data);
		});
	}, []);

	useEffect(() => {
		sessionStorage.setItem("expanded", JSON.stringify(expanded));
	}, [expanded]);

	return (
		<SidebarProvider defaultOpen={expanded} className="">
			<AppSidebar setUser={setUser} setToken={setToken} />
			{/* <Navbar setUser={setUser} setToken={setToken} /> */}
			<SidebarTrigger className="block md:hidden fixed" />
			{/* <main className="my-14 mx-auto"> */}
			<main className="flex w-screen min-h-screen flex-col items-center justify-between p-16">
				<Outlet />
			</main>
		</SidebarProvider>
	);
}
