"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Calendar
import { format, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/contexts/ToastContextProvider";
import axiosClient from "@/axios.client";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import DateInput from "@/components/form/DateInput";
import { API } from "@/constants/api";
import { useUsersStore } from "@/store/users/usersStore";
import { useUserStore } from "@/store/user/userStore";

const formSchema = z.object({
	name: z.string().refine((data) => data.trim() !== "", {
		message: "Name is required.",
	}),
	position: z.string().refine((data) => data.trim() !== "", {
		message: "Position is required.",
	}),
	dob: z.date({
		required_error: "Birthday is required.",
	}),
	role: z.string().refine((data) => data.trim() !== "", {
		message: "Role is required.",
	}),
	email: z.string().refine((data) => data.trim() !== "", {
		message: "Email is required.",
	}),
	status: z.string().refine((data) => data.trim() !== "", {
		message: "Status is required.",
	}),
});

export default function UserForm({ setIsOpen, updateData, setUpdateData, userProfileId }) {
	const { user: user_auth, setUser } = useAuthContext();
	const { loading, setLoading } = useLoadContext();
	const showToast = useToast();
	const { addUser, updateUser } = useUsersStore();
	const { setUser: setProfileUser } = useUserStore();

	const [date, setDate] = useState();

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			position: "",
			dob: undefined,
			role: "",
			email: "",
			status: "",
		},
	});
	useEffect(() => {
		if (updateData) {
			const { name, position, dob, role, email, status } = updateData;
			form.reset({
				name,
				position,
				dob: dob ? parseISO(dob) : undefined,
				role,
				email,
				status,
			});
			setDate(dob ? parseISO(dob) : undefined);
		}
	}, [updateData, form]);

	const handleSubmit = async (form) => {
		const formattedData = {
			...form,
			organization_id: user_auth.data.organization_id,
			dob: form.dob ? format(form.dob, "yyyy-MM-dd") : null, // Format to Y-m-d
			password: "$2y$12$tXliF33idwwMmvk1tiF.ZOotEsqQnuWinaX90NLaw.rEchjbEAXCW", //password: admin123
		};
		setLoading(true);
		try {
			if (Object.keys(updateData).length === 0) {
				const userResponse = await axiosClient.post(API().user(), formattedData);
				addUser(userResponse.data.data);
				showToast("Success!", "User added.", 3000);
			} else {
				const userResponse = await axiosClient.put(API().user(updateData?.id), formattedData);
				updateUser(updateData.id, userResponse.data.data);
				if (userProfileId) setProfileUser(userResponse.data.data);
				// Update auth user data if the updated user is the current logged-in user
				if (user_auth.id === userResponse.data.data.id) setUser(userResponse.data.data);
				showToast("Success!", "User updated.", 3000);
			}
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 3000, "fail");
			console.error("Error fetching data:", e);
		} finally {
			setUpdateData({});
			setLoading(false);
			setIsOpen(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4 max-w-md w-full">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder="User name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				{user_auth?.data?.role !== "Employee" && (
					<FormField
						control={form.control}
						name="role"
						render={({ field }) => {
							const roles = [
								{ id: 1, name: "Superadmin" },
								{ id: 2, name: "Admin" },
								{ id: 3, name: "Manager" },
								{ id: 4, name: "Employee" },
							];
							return (
								<FormItem>
									<FormLabel>Role</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={updateData?.role || field.value}
										disabled={user_auth?.data?.role === "Employee"}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a role"></SelectValue>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{Array.isArray(roles) && roles.length > 0 ? (
												roles?.map((role) => (
													<SelectItem key={role?.id} value={role?.name}>
														{role?.name}
													</SelectItem>
												))
											) : (
												<SelectItem disabled>No roles available</SelectItem>
											)}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
				)}
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="Email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="position"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Position</FormLabel>
								<FormControl>
									<Input placeholder="User position" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="dob"
					render={({ field }) => {
						return <DateInput field={field} label={"Birthday"} placeholder={"Pick a date"} disableFuture={true} />;
					}}
				/>
				{user_auth?.data?.role !== "Employee" && (
					<FormField
						control={form.control}
						name="status"
						render={({ field }) => {
							const statuses = [
								{ id: 1, name: "Pending" },
								{ id: 2, name: "Active" },
								{ id: 3, name: "Inactive" },
								{ id: 4, name: "Rejected" },
								{ id: 5, name: "Banned" },
							];
							return (
								<FormItem>
									<FormLabel>Status</FormLabel>
									<Select
										disabled={user_auth?.data?.role === "Employee"}
										onValueChange={field.onChange}
										defaultValue={updateData?.status || field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a status"></SelectValue>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{Array.isArray(statuses) && statuses.length > 0 ? (
												statuses?.map((status) => (
													<SelectItem key={status?.id} value={status?.name.toLowerCase()}>
														{status?.name}
													</SelectItem>
												))
											) : (
												<SelectItem disabled>No statuses available</SelectItem>
											)}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
				)}
				<Button type="submit" disabled={loading}>
					{loading && <Loader2 className="animate-spin mr-5 -ml-11 text-background" />} {Object.keys(updateData).length === 0 ? "Submit" : "Update"}
				</Button>
			</form>
		</Form>
	);
}
