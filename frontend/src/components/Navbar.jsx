import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios.client";
import { useScrollContext } from "@/contexts/ScrollContextProvider";
import { SidebarTrigger } from "./ui/sidebar";
import { MoonStar, Sun } from "lucide-react";
import { useSidebarContext } from "@/contexts/SidebarContextProvider";

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function Navbar({ setUser, setToken }) {
	const { scrolled } = useScrollContext();
	const { expanded } = useSidebarContext();

	const onLogout = (e) => {
		e.preventDefault();
		axiosClient.post("/logout").then(() => {
			setUser({});
			setToken(null);
		});
	};
	return (
		<Disclosure as="nav" className={scrolled ? "scrolled top-0 left-0 right-0 backdrop-blur-3xl shadow navbar" : "top-0 left-0 right-0 navbar"}>
			{({ open }) => (
				<>
					<div className="flex justify-between mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
						<SidebarTrigger className="block md:hidden" />
						<div className="relative flex h-16 items-center justify-end">
							<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:fpr-0">
								<button
									type="button"
									className="relative rounded-full bg-primary-2 p-1 text-primary-text hover:bg-primary-3 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
								>
									<span className="absolute -inset-1.5" />
									<span className="sr-only">View notifications</span>
									<BellIcon className="h-6 w-6" aria-hidden="true" />
								</button>

								{/* Profile dropdown */}
								<Menu as="div" className="relative ml-3">
									<div>
										<MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
											<span className="absolute -inset-1.5" />
											<span className="sr-only">Open user menu</span>
											<img
												className="h-8 w-8 rounded-full"
												src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
												alt=""
											/>
										</MenuButton>
									</div>
									<MenuItems
										trantion
										className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
									>
										<MenuItem>
											{({ focus }) => (
												<a href="#" className={classNames(focus ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}>
													Your Profile
												</a>
											)}
										</MenuItem>
										<MenuItem>
											{({ focus }) => (
												<a href="#" className={classNames(focus ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}>
													Settings
												</a>
											)}
										</MenuItem>
										<MenuItem>
											{({ focus }) => (
												<a
													href="#"
													className={classNames(focus ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}
													onClick={onLogout}
												>
													Sign out
												</a>
											)}
										</MenuItem>
									</MenuItems>
								</Menu>
							</div>
						</div>
					</div>

					{/* Mobile menu */}
					{/* <DisclosurePanel className="sm:hidden">
						<div className="space-y-1 px-2 pb-3 pt-2">
							{navigation.map((item) => (
								<Link
									key={item.name}
									to={item.href}
									onClick={() => onUpdateActiveLink(item.name)}
									className={classNames(
										activeLink === item.name ? "bg-blue-950 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
										"block rounded-md px-3 py-2 text-base font-medium"
									)}
									aria-current={activeLink === item.name ? "page" : undefined}
								>
									{item.name}
								</Link>
							))}
						</div>
					</DisclosurePanel> */}
				</>
			)}
		</Disclosure>
	);
}
