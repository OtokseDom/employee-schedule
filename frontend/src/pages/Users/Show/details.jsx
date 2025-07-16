"use client";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { Edit } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import axiosClient from "@/axios.client";
import { useToast } from "@/contexts/ToastContextProvider";
import { useNavigate } from "react-router-dom";

export default function UserDetails({ user, handleUpdateUser, handleApproval }) {
	const { user: user_auth } = useAuthContext();
	const { loading, setLoading } = useLoadContext();
	const showToast = useToast();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogType, setDialogType] = useState(null);
	const navigate = useNavigate();

	const openDialog = (type) => {
		setDialogType(type);
		setDialogOpen(true);
	};

	const handleDelete = async (id) => {
		setLoading(true);
		try {
			await axiosClient.delete(`/user/${id}`);
			showToast("Success!", "User deleted.", 3000);
			navigate("/users");
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 3000, "fail");
			console.error("Error fetching data:", e);
		} finally {
			setLoading(false);
		}
	};

	const {
		name = "Galactic Explorer",
		position = "Captain of the Starship",
		email = "captain@stardust.com",
		role = "Stardust Collector",
		status = "Active",
		dob = "Unknown",
	} = user || {};

	const isEditable = user_auth?.data?.role === "Superadmin" || user_auth?.data?.id === user?.id;

	return (
		<div className="absolute inset-0 flex flex-col justify-center items-start p-6 bg-gradient-to-r from-black/50 to-transparent">
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
						<Button
							onClick={() => {
								if (dialogType === "reject") handleApproval(0, user.id);
								else if (dialogType === "delete") handleDelete(user.id);
							}}
						>
							Yes, delete
						</Button>
					</DialogFooter>
				</DialogContent>

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
									<span className="flex gap-3 text-md md:text-3xl font-bold text-white mb-0 md:mb-2">{name}</span>
									<span className="text-xs md:text-lg text-purple-200">{position}</span>
								</div>
							</div>

							{isEditable && (
								<DropdownMenu modal={false}>
									<DropdownMenuTrigger asChild>
										<Button variant="default" className="flex items-center bg-foreground text-background">
											<Edit size={20} />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										{user?.status == "pending" && (
											<>
												<DropdownMenuItem className="cursor-pointer text-green-500" onClick={() => handleApproval(1, user.id)}>
													Approve User
												</DropdownMenuItem>
												<DropdownMenuItem className="cursor-pointer text-red-500" onClick={() => openDialog("reject")}>
													Reject User
												</DropdownMenuItem>
												<hr />
											</>
										)}
										<DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdateUser(user)}>
											Update Account
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => openDialog("delete")}>
											<DialogTrigger asChild>
												<span className="cursor-pointer">Deactivate Account</span>
											</DialogTrigger>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							)}
						</div>
					)}

					{loading ? (
						<div className="flex gap-5">
							<Skeleton className="w-24 h-8 rounded-full" />
							<Skeleton className="w-24 h-8 rounded-full" />
						</div>
					) : (
						<div className="flex flex-wrap mt-4 gap-2 md:gap-4">
							<div
								className={`backdrop-blur-sm px-3 py-1 w-fit rounded-full flex items-center ${
									status === "pending"
										? "text-yellow-100 bg-yellow-900/50"
										: status === "active"
										? "text-green-100 bg-green-900/50"
										: status === "inactive"
										? "text-gray-100 bg-gray-900/50"
										: status === "banned"
										? "text-red-100 bg-red-900/50"
										: ""
								}`}
							>
								{status}
							</div>
							<div className="bg-purple-900/50 backdrop-blur-sm px-3 py-1 w-fit rounded-full flex items-center text-purple-100">✨{role}</div>
							<div className="bg-indigo-900/50 backdrop-blur-sm px-3 py-1 w-fit rounded-full flex items-center text-indigo-100">🌌 {email}</div>
						</div>
					)}
				</div>
			</Dialog>
		</div>
	);
}
