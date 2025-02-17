import { Box, Calendar, ChevronDown, ChevronUp, Home, Inbox, MoonStar, Search, Settings, Sun, User2, Workflow } from "lucide-react";

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
	SidebarMenuSubItem,
	SidebarMenuSub,
	SidebarMenuBadge,
	SidebarMenuSkeleton,
	SidebarSeparator,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "@/axios.client";

// Menu items.
const items = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: Home,
	},
	{
		title: "Users",
		url: "/users",
		icon: Inbox,
	},
	{
		title: "Products",
		url: "/products",
		icon: Box,
	},
	{
		title: "Calendar",
		url: "#",
		icon: Calendar,
	},
	{
		title: "Search",
		url: "#",
		icon: Search,
	},
	{
		title: "Settings",
		url: "#",
		icon: Settings,
	},
];
export function AppSidebar({ setUser, setToken }) {
	// Darkmode set session
	const [theme, setTheme] = useState(() => {
		const savedMode = sessionStorage.getItem("theme");
		return savedMode ? JSON.parse(savedMode) : "dark"; // Default to false if nothing is saved
	});
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
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarTrigger className="hidden md:flex" />

					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton>
									<Workflow /> Select Workspace
									<ChevronDown className="ml-auto" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-[--radix-popper-anchor-width]">
								<DropdownMenuItem>
									<span>Acme Inc</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<span>Acme Corp.</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
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
						<SidebarMenu>
							<Collapsible defaultOpen className="group/collapsible">
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton>
											<ChevronDown /> Settings
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{/* <SidebarMenuSubItem /> */}
											{items.map((item) => (
												<SidebarMenuItem key={item.title}>
													<SidebarMenuButton asChild>
														<a href={item.url}>
															<item.icon />
															<span>{item.title}</span>
														</a>
													</SidebarMenuButton>
												</SidebarMenuItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
									<SidebarMenuBadge>24</SidebarMenuBadge>
								</SidebarMenuItem>
							</Collapsible>
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
									<User2 /> Username
									<ChevronUp className="ml-auto" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
								<DropdownMenuItem>
									<span>Account</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<span>Billing</span>
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
