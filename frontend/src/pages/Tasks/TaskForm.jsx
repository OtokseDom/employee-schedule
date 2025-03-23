"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axiosClient from "@/axios.client";
import { useToast } from "@/contexts/ToastContextProvider";
import { useEffect, useState } from "react";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";
import DateInput from "@/components/form/DateInput";

const formSchema = z.object({
	assignee_id: z.string({
		required_error: "Assignee is required.",
	}),
	category: z.string().refine((data) => data.trim() !== "", {
		message: "Category is required.",
	}),
	title: z.string().refine((data) => data.trim() !== "", {
		message: "Title is required.",
	}),
	description: z.string().refine((data) => data.trim() !== "", {
		message: "Description is required.",
	}),
	expected_output: z.string().optional(),
	start_date: z.date({
		required_error: "Start date is required.",
	}),
	end_date: z.date().optional(),
	time_estimate: z.coerce.number().optional(),
	delay: z.coerce.number().optional(),
	delay_reason: z.string().optional(),
	performance_rating: z.coerce.number().min(0).max(10).optional(),
	remarks: z.string().optional(),
	status: z.string({
		required_error: "Status is required.",
	}),
});

export default function TaskForm({ data, setTasks, isOpen, setIsOpen, updateData, setUpdateData, fetchData }) {
	const { loading, setLoading } = useLoadContext();
	const showToast = useToast();
	const [users, setUsers] = useState();

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			assignee_id: undefined,
			category: "",
			expected_output: "",
			start_date: undefined,
			end_date: undefined,
			time_estimate: "",
			delay: "",
			delay_reason: "",
			performance_rating: "",
			remarks: "",
			status: undefined,
		},
	});
	useEffect(() => {
		fetchUsers();
	}, [isOpen]);
	const fetchUsers = async () => {
		setLoading(true);
		try {
			const userResponse = await axiosClient.get("/user-auth");
			setUsers(userResponse.data.users);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!isOpen) setUpdateData({});
	}, [isOpen]);

	useEffect(() => {
		if (updateData) {
			const {
				title,
				description,
				assignee_id,
				category,
				expected_output,
				start_date,
				end_date,
				time_estimate,
				delay,
				delay_reason,
				performance_rating,
				remarks,
				status,
			} = updateData;
			form.reset({
				title,
				description,
				assignee_id,
				category,
				expected_output,
				start_date: start_date ? parseISO(start_date) : undefined,
				end_date: end_date ? parseISO(end_date) : undefined,
				time_estimate,
				delay,
				delay_reason,
				performance_rating,
				remarks,
				status,
			});
		}
	}, [updateData, form]);

	const handleSubmit = async (formData) => {
		setLoading(true);
		try {
			// Parse numeric fields
			const parsedForm = {
				...formData,
				start_date: formData.start_date ? format(formData.start_date, "yyyy-MM-dd") : null,
				end_date: formData.end_date ? format(formData.end_date, "yyyy-MM-dd") : null,
				time_estimate: formData.time_estimate ? parseFloat(formData.time_estimate) : undefined,
				delay: formData.delay ? parseFloat(formData.delay) : undefined,
				performance_rating: formData.performance_rating ? parseInt(formData.performance_rating, 10) : undefined,
			};

			if (Object.keys(updateData).length === 0) {
				await axiosClient.post(`/task`, parsedForm);
				fetchData();
				showToast("Success!", "Task added.", 3000);
				setIsOpen(false);
			} else {
				await axiosClient.put(`/task/${updateData?.id}`, parsedForm);
				fetchData();
				showToast("Success!", "Task updated.", 3000);
				setIsOpen(false);
				setUpdateData({});
			}
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 3000);
			console.error("Error fetching data:", e);
			if (e.response?.data?.errors) {
				const backendErrors = e.response.data.errors;
				Object.keys(backendErrors).forEach((field) => {
					form.setError(field, {
						type: "backend",
						message: backendErrors[field][0],
					});
				});
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4 max-w-md w-full">
				<FormField
					control={form.control}
					name="assignee_id"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Assignee</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select an assignee">
												{updateData.id && !field.value
													? users.find((user) => user?.id == updateData.user)?.name
													: field.value
													? users.find((user) => user?.id == field.value)?.name
													: "Select an assignee"}
											</SelectValue>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{Array.isArray(users) && users.length > 0 ? (
											users?.map((user) => (
												<SelectItem key={user?.id} value={user?.id}>
													{user?.name}
												</SelectItem>
											))
										) : (
											<></>
										)}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="category"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Category</FormLabel>
								<FormControl>
									<Input placeholder="Category" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input placeholder="Title" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea placeholder="Description" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="expected_output"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Expected output</FormLabel>
								<FormControl>
									<Textarea placeholder="Expected output" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="start_date"
					render={({ field }) => {
						return <DateInput field={field} label={"Start date"} placeholder={"Select start date"} />;
					}}
				/>
				<FormField
					control={form.control}
					name="end_date"
					render={({ field }) => {
						return <DateInput field={field} label={"End date"} placeholder={"Select end date"} />;
					}}
				/>
				<FormField
					control={form.control}
					name="time_estimate"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Time Estimate &#40;hrs&#41;</FormLabel>
								<FormControl>
									<Input type="number" step="any" placeholder="Time estimate &#40;hrs&#41;" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="delay"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Delay &#40;hrs&#41;</FormLabel>
								<FormControl>
									<Input type="number" step="any" placeholder="Delay &#40;hrs&#41;" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="delay_reason"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Delay reason</FormLabel>
								<FormControl>
									<Textarea placeholder="Delay reason" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="performance_rating"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Rating &#40;1-10&#41;</FormLabel>
								<FormControl>
									<Input type="number" step="any" placeholder="Rating &#40;1-10&#41;" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="remarks"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Remarks</FormLabel>
								<FormControl>
									<Textarea placeholder="Remarks" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="status"
					render={({ field }) => {
						const statuses = [
							{ id: 1, name: "Pending" },
							{ id: 2, name: "In Progress" },
							{ id: 3, name: "Completed" },
							{ id: 4, name: "Delayed" },
							{ id: 5, name: "On Hold" },
						];
						return (
							<FormItem>
								<FormLabel>Status</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={updateData?.status || field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a status"></SelectValue>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{Array.isArray(statuses) && statuses.length > 0 ? (
											statuses?.map((status) => (
												<SelectItem key={status?.id} value={status?.name}>
													{status?.name}
												</SelectItem>
											))
										) : (
											<SelectItem disabled>No status available</SelectItem>
										)}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<Button type="submit" disabled={loading}>
					{loading && <Loader2 className="animate-spin mr-5 -ml-11 text-foreground" />} {Object.keys(updateData).length === 0 ? "Submit" : "Update"}
				</Button>
			</form>
		</Form>
	);
}
