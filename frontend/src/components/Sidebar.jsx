import { MoreVertical, ChevronLast, ChevronFirst, LayoutDashboard, Menu } from "lucide-react";
import { useContext, createContext, useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { useSidebarContext } from "@/contexts/SidebarContextProvider";
import { Link } from "react-router-dom";
import { useScrollContext } from "@/contexts/ScrollContextProvider";

// const SidebarContext = createContext();
function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}
export default function Sidebar({ children }) {
	const { expanded, setExpanded } = useSidebarContext();
	const { scrolled } = useScrollContext();
	const [activeLink, setActiveLink] = useState("Dashboard");
	const navigation = [
		{ name: "Dashboard", href: "/dashboard", current: false },
		{ name: "Users", href: "/users", current: false },
		{ name: "Projects", href: "#", current: false },
		{ name: "Calendar", href: "#", current: false },
	];
	useEffect(() => {
		sessionStorage.setItem("expanded", JSON.stringify(expanded));
	}, [expanded]);
	const onUpdateActiveLink = (value) => {
		setActiveLink(value);
	};

	return (
		<>
			<aside className={`sm:hidden h-screen ${expanded ? "hidden" : "visible"}`}>
				<div className="p-4 pb-2 flex justify-between items-center">
					<img src={logo} className={`overflow-hidden transition-all ${expanded ? "w-24" : "w-0"}`} alt="" />
					<button onClick={() => setExpanded((curr) => !curr)} className={`p-1.5 text-foreground sidebar ${scrolled ? "scrolled" : ""}`}>
						<Menu />
					</button>
				</div>
			</aside>
			<aside className="sm:block h-screen">
				<nav className="h-full flex flex-col bg-background text-foreground shadow-gray-900 shadow-md">
					<div className="p-4 pb-2 flex justify-between items-center">
						<img src={logo} className={`overflow-hidden transition-all ${expanded ? "w-24" : "w-0"}`} alt="" />
						<button onClick={() => setExpanded((curr) => !curr)} className="p-1.5 rounded-lg">
							{expanded ? <ChevronFirst /> : <ChevronLast />}
						</button>
					</div>

					{/* <SidebarContext.Provider value={{ expanded }}> */}
					<ul className="flex-1 px-3">
						{/* {children} */}
						{navigation.map((item) => (
							<Link
								key={item.name}
								to={item.href}
								onClick={() => onUpdateActiveLink(item.name)}
								aria-current={activeLink === item.name ? "page" : undefined}
							>
								<li
									className={`
										relative flex items-center py-2 px-3 my-1
										rounded-md cursor-pointer
										transition-colors group
										${
											activeLink === item.name
												? "bg-gradient-to-tr from-foreground to-background text-background font-extrabold"
												: "hover:bg-gradient-to-bl from-foreground to-background hover:text-foreground"
										}
									`}
								>
									{/* {icon} */}
									<LayoutDashboard size={20} />
									<span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{item.name}</span>
									{alert && <div className={`absolute right-2 w-2 h-2 rounded bg-foreground ${expanded ? "" : "top-2"}`} />}
									{!expanded && (
										//Collapsed tooltip
										<div
											className={`
												absolute left-full rounded-md px-2 py-1 ml-6
												bg-foreground text-background text-sm
												invisible opacity-20 -translate-x-3 transition-all
												group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
											`}
										>
											{item.name}
										</div>
									)}
								</li>
								{/* {item.name} */}
							</Link>
						))}
					</ul>
					{/* </SidebarContext.Provider> */}

					<div className="border-t border-gray-700 flex p-3">
						{/* <img src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true" alt="" className="w-10 h-10 rounded-md" /> */}
						<div className="bg-indigo-50 w-10 h-10 rounded-md flex justify-center items-center font-black text-xl text-deep-purple-700">JD</div>
						<div
							className={`
								flex justify-between items-center
								overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
							`}
						>
							<div className="leading-4">
								<h4 className="font-semibold">John Doe</h4>
								<span className="text-xs text-gray-600">johndoe@gmail.com</span>
							</div>
							<MoreVertical size={20} />
						</div>
					</div>
				</nav>
			</aside>
		</>
	);
}

export function SidebarItem({ icon, text, active, alert }) {
	const { expanded } = useSidebarContext();

	return (
		<li
			className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${active ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800" : "hover:bg-indigo-50 text-gray-600"}
    `}
		>
			{icon}
			<span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
			{alert && <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`} />}

			{!expanded && (
				<div
					className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
				>
					{text}
				</div>
			)}
		</li>
	);
}
