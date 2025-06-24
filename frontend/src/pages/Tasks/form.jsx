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
import { Label } from "@/components/ui/label";

const formSchema = z.object({
	assignee_id: z.number({
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
	start_date: z.date().optional(),
	end_date: z.date().optional(),
	start_time: z.string().optional(),
	end_time: z.string().optional(),
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
			start_time: "",
			end_time: "",
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
		// setLoading(true);
		try {
			const userResponse = await axiosClient.get("/user");
			setUsers(userResponse.data.users);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			// setLoading(false);
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
				start_time,
				end_time,
				time_estimate,
				delay,
				delay_reason,
				performance_rating,
				remarks,
				status,
			} = updateData;
			form.reset({
				title: title || "",
				description: description || "",
				assignee_id: assignee_id || undefined,
				category: category || "",
				expected_output: expected_output || "",
				start_date: start_date ? parseISO(start_date) : undefined,
				end_date: end_date ? parseISO(end_date) : undefined,
				start_time: start_time || "",
				end_time: end_time || "",
				time_estimate: time_estimate || "",
				delay: delay || "",
				delay_reason: delay_reason || "",
				performance_rating: performance_rating || "",
				remarks: remarks || "",
				status: status || undefined,
			});
		}
	}, [updateData, form, users]);

	const handleSubmit = async (formData) => {
		setLoading(true);
		try {
			// Parse numeric fields
			const formatTime = (time) => {
				if (!time) return "";
				// If already in HH:mm:ss, return as is
				if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time;
				// If in HH:mm, append :00
				if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`;
				return time;
			};

			const parsedForm = {
				...formData,
				start_date: formData.start_date ? format(formData.start_date, "yyyy-MM-dd") : null,
				end_date: formData.end_date ? format(formData.end_date, "yyyy-MM-dd") : null,
				start_time: formatTime(formData.start_time),
				end_time: formatTime(formData.end_time),
				time_estimate: formData.time_estimate ? parseFloat(formData.time_estimate) : undefined,
				delay: formData.delay ? parseFloat(formData.delay) : undefined,
				performance_rating: formData.performance_rating ? parseInt(formData.performance_rating, 10) : undefined,
			};
			console.log(parsedForm);
			if (Object.keys(updateData).length === 0) {
				console.log("add");
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
			showToast("Failed!", e.response?.data?.message, 3000, "fail");
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
								<Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={updateData?.assignee_id || field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select an assignee">
												{field.value ? users?.find((user) => user.id == field.value)?.name : "Select an assignee"}
											</SelectValue>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{Array.isArray(users) && users.length > 0 ? (
											users.map((user) => (
												<SelectItem key={user.id} value={user.id.toString()}>
													{user.name}
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
					name="start_time"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Start Time</FormLabel>
								<FormControl>
									<Input
										type="time"
										step="60"
										inputMode="numeric"
										pattern="[0-9]{2}:[0-9]{2}"
										className="bg-background appearance-none"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="end_time"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>End Time</FormLabel>
								<FormControl>
									<Input
										type="time"
										step="any"
										// placeholder="Rating &#40;1-10&#41;"
										className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						);
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
							{ id: 6, name: "Cancelled" },
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
