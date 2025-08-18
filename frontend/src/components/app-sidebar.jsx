import { ChevronUp, MoonStar, Sun, User2, ClipboardList, Users2, CalendarClock, Settings, Tag, ChevronDown, Gauge, Building, FolderKanban } from "lucide-react";
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
	SidebarMenuSub,
	SidebarMenuSubItem,
	useSidebar, // for auto closing sidebar on mobile location change
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "@/axios.client";
import { sub } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import { API } from "@/constants/api";

// Menu items.
const items = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: Gauge,
		collapsible: false,
		subItems: [],
	},
	{
		title: "Calendar",
		url: "/calendar",
		icon: CalendarClock,
		collapsible: false,
		subItems: [],
	},
	{
		title: "Tasks",
		url: "/tasks",
		icon: ClipboardList,
		collapsible: false,
		subItems: [],
	},
	{
		title: "Projects",
		url: "/projects",
		icon: FolderKanban,
		collapsible: false,
		subItems: [],
	},
	{
		title: "Members",
		url: "/users",
		icon: Users2,
		collapsible: false,
		subItems: [],
	},
	{
		title: "Settings",
		url: "/settings",
		icon: Settings,
		collapsible: true,
		subItems: [
			{
				title: "Categories",
				url: "/categories",
				icon: Tag,
				collapsible: false,
				subItems: [],
			},
			{
				title: "Organization",
				url: "/organization",
				icon: Building,
				collapsible: false,
				subItems: [],
			},
		],
	},
];

export function AppSidebar() {
	const { user, setToken, setUser } = useAuthContext();
	const { isMobile, openMobile, setOpenMobile } = useSidebar(); // Add this line

	// Darkmode set session
	const [theme, setTheme] = useState(() => {
		const savedMode = sessionStorage.getItem("theme");
		return savedMode ? JSON.parse(savedMode) : "dark"; // Default to false if nothing is saved
	});
	const navigate = useNavigate();
	const location = useLocation();

	// Close mobile sidebar when route changes
	useEffect(() => {
		if (isMobile && openMobile) {
			setOpenMobile(false);
		}
	}, [location.pathname]);

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
		axiosClient.post(API().logout).then(() => {
			setUser({});
			setToken(null);
		});
	};
	const [currentPath, setCurrentPath] = useState(location.pathname);
	useEffect(() => {
		setCurrentPath(location.pathname);
	}, [location.pathname]);
	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<div className="flex justify-between cursor-pointer" onClick={() => navigate("/")}>
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
							{items.map((item) =>
								!item.collapsible ? (
									<Link key={item.title} to={item.url} onClick={() => setCurrentPath(item.url)}>
										<SidebarMenuItem key={item.title}>
											<SidebarMenuButton isActive={currentPath === item.url || currentPath.startsWith(item.url + "/")} asChild>
												<span>
													<item.icon />
													{item.title}
												</span>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</Link>
								) : (
									<Collapsible key={item.title} className="group/collapsible cursor-pointer">
										<SidebarMenuItem>
											<CollapsibleTrigger asChild>
												<SidebarMenuButton isActive={currentPath === item.url || currentPath.startsWith(item.url + "/")} asChild>
													<span className="flex flex-row justify-between">
														<span className="flex items-center gap-2">
															<item.icon size={16} />
															{item.title}
														</span>
														<span>
															<ChevronDown
																size={18}
																className="transition-transform duration-200 group-data-[state=closed]/collapsible:rotate-[-90deg]"
															/>
														</span>
													</span>
												</SidebarMenuButton>
											</CollapsibleTrigger>
											<CollapsibleContent>
												<SidebarMenuSub>
													{item.subItems.map((subItem) => (
														<Link
															key={subItem.title}
															to={item.url + subItem.url}
															onClick={() => setCurrentPath(item.url + subItem.url)}
														>
															<SidebarMenuSubItem>
																<SidebarMenuButton
																	isChild={true}
																	key={subItem.title}
																	isActive={
																		currentPath === item.url + subItem.url ||
																		currentPath.startsWith(item.url + subItem.url + "/")
																	}
																	asChild
																>
																	<span>
																		<subItem.icon />
																		{subItem.title}
																	</span>
																</SidebarMenuButton>
															</SidebarMenuSubItem>
														</Link>
													))}
												</SidebarMenuSub>
											</CollapsibleContent>
										</SidebarMenuItem>
									</Collapsible>
								)
							)}
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
									<User2 /> {user?.data?.name}
									<ChevronUp className="ml-auto" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
								<Link to={`/users/${user?.data?.id}`}>
									<DropdownMenuItem>Account</DropdownMenuItem>
								</Link>
								<DropdownMenuItem onClick={onLogout}>Sign out</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
					<SidebarMenuItem className="block md:hidden">
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
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
