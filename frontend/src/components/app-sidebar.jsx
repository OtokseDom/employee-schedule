import { ChevronUp, MoonStar, Sun, User2, Calendar, ClipboardList, Users2, CalendarClock } from "lucide-react";
import logo from "../assets/logo.png";

import {
	Sidebar,
	SidebarHeader,
	SidebarFooter,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "@/axios.client";

// Menu items.
const items = [
	{
		title: "Schedules",
		url: "/schedule",
		icon: CalendarClock,
	},
	{
		title: "Schedules V2",
		url: "/v2/schedule",
		icon: CalendarClock,
	},
	{
		title: "Events",
		url: "/event",
		icon: Calendar,
	},
	{
		title: "Tasks",
		url: "/task",
		icon: ClipboardList,
	},
	{
		title: "Users",
		url: "/users",
		icon: Users2,
	},
];
export function AppSidebar({ user, setUser, setToken }) {
	// Darkmode set session
	const [theme, setTheme] = useState(() => {
		const savedMode = sessionStorage.getItem("theme");
		return savedMode ? JSON.parse(savedMode) : "dark"; // Default to false if nothing is saved
	});
	const navigate = useNavigate();
	useEffect(() => {
		sessionStorage.setItem("theme", JSON.stringify(theme));
		if (theme == "dark") {
			document.documentElement.classList.remove("light");
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
			document.documentElement.classList.add("light");
		}
	}, [theme]);

	const toggleDark = () => {
		if (theme == "dark") {
			setTheme("light");
		} else {
			setTheme("dark");
		}
	};

	const onLogout = (e) => {
		e.preventDefault();
		axiosClient.post("/logout").then(() => {
			setUser({});
			setToken(null);
		});
	};
	const [currentPath, setCurrentPath] = useState(location.pathname);
	useEffect(() => {
		setCurrentPath(location.pathname);
	}, []);
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<div className="flex justify-between">
						<img src={logo} className="overflow-hidden transition-all w-20" alt="logo" />
						<SidebarTrigger className="hidden md:flex w-8 h-8" />
					</div>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarSeparator />
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel asChild>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<Link key={item.title} to={item.url} onClick={() => setCurrentPath(item.url)}>
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton isActive={currentPath.startsWith(item.url)} asChild>
											<span>
												<item.icon />
												{item.title}
											</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</Link>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						{theme == "light" ? (
							<SidebarMenuButton onClick={toggleDark}>
								<MoonStar size={16} />
								<span className="ml-2">Dark Mode</span>
							</SidebarMenuButton>
						) : (
							<SidebarMenuButton onClick={toggleDark}>
								<Sun size={16} />
								<span className="ml-2">Light Mode</span>
							</SidebarMenuButton>
						)}
					</SidebarMenuItem>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton>
									<User2 /> {user.name}
									<ChevronUp className="ml-auto" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
								<DropdownMenuItem onClick={() => navigate(`/profile/${user.id}`)}>
									<span>Account</span>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={onLogout}>
									{/* <a href="#" onClick={onLogout}> */}
									Sign out
									{/* </a> */}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
