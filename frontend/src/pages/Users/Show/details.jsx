"use client";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { useAuthContext } from "@/contexts/AuthContextProvider";
// Shadcn UI
import { Button } from "@/components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { Edit } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function UserDetails({ user, handleUpdateUser, handleDelete }) {
	const { user: user_auth } = useAuthContext(); // Get authenticated user details
	const { loading } = useLoadContext();
	const {
		name = "Galactic Explorer",
		position = "Captain of the Starship",
		email = "captain@stardust.com",
		role = "Stardust Collector",
		status = "Active",
		dob = "Unknown",
	} = user || {};

	return (
		<div className="absolute inset-0 flex flex-col justify-center items-start p-6 bg-gradient-to-r from-black/50 to-transparent">
			<div className="flex flex-col gap-3 w-full">
				{loading ? (
					<div className="flex gap-5">
						<Skeleton className="w-24 h-24 rounded-full" />
						<div className="flex flex-col gap-2">
							<Skeleton className="w-60 h-10 rounded-full" />
							<Skeleton className="w-60 h-10 rounded-full" />
						</div>
					</div>
				) : (
					<div className="flex items-start justify-between w-full">
						<div className="flex gap-5 items-center">
							<div>
								<div className="w-24 h-24 bg-foreground rounded-full"></div>
							</div>
							<div className="w-full">
								<span className="flex gap-3 text-md md:text-3xl  font-bold text-white mb-0 md:mb-2">{name}</span>
								<span className="text-xs md:text-lg text-purple-200">{position}</span>
							</div>
						</div>
						{user_auth?.data?.role === "Superadmin" || user_auth?.data?.id === user?.id ? (
							<Dialog>
								<DropdownMenu modal={false}>
									<DropdownMenuTrigger asChild>
										<Button variant="default" className="flex items-center bg-foreground text-background">
											<Edit size={20} />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdateUser(user)}>
											Update Account
										</DropdownMenuItem>
										<DropdownMenuItem>
											<DialogTrigger>Deactivate Account</DialogTrigger>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Are you absolutely sure?</DialogTitle>
										<DialogDescription>This action cannot be undone.</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<DialogClose asChild>
											<Button type="button" variant="secondary">
												Close
											</Button>
										</DialogClose>
										<Button onClick={() => handleDelete(user.id)}>Yes, delete</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						) : (
							""
						)}
					</div>
				)}
				{/* User stats */}
				{loading ? (
					<div className="flex gap-5">
						<Skeleton className="w-24 h-8 rounded-full" />
						<Skeleton className="w-24 h-8 rounded-full" />
					</div>
				) : (
					<div className="flex flex-wrap mt-4 gap-2 md:gap-4">
						<div
							className={`backdrop-blur-sm px-3 py-1 w-fit rounded-full flex  items-center
                            ${
								status == "pending"
									? "text-yellow-100 bg-yellow-900/50"
									: status == "active"
									? "text-green-100 bg-green-900/50"
									: status == "inactive"
									? "text-gray-100 bg-gray-900/50"
									: status == "banned"
									? "text-red-100 bg-red-900/50"
									: ""
							}`}
						>
							{status}
						</div>
						<div className="bg-purple-900/50 backdrop-blur-sm px-3 py-1 w-fit rounded-full flex  items-center text-purple-100">✨{role}</div>
						<div className="bg-indigo-900/50 backdrop-blur-sm px-3 py-1 w-fit rounded-full flex  items-center text-indigo-100">🌌 {email}</div>
					</div>
				)}
			</div>
		</div>
	);
}
