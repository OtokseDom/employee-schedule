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
import { useAuthContext } from "@/contexts/AuthContextProvider";

const formSchema = z.object({
	assignee_id: z.number({
		required_error: "Assignee is required.",
	}),
	category_id: z.number({
		required_error: "Category is required.",
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
	time_taken: z.coerce.number().optional(),
	delay: z.coerce.number().optional(),
	delay_reason: z.string().optional(),
	performance_rating: z.coerce.number().min(0).max(10).optional(),
	remarks: z.string().optional(),
	status: z.string({
		required_error: "Status is required.",
	}),
	calendar_add: z.boolean().optional(),
});
export default function TaskForm({ users, categories, setTaskAdded, isOpen, setIsOpen, updateData, setUpdateData, fetchData }) {
	const { loading, setLoading } = useLoadContext();
	const { user: user_auth } = useAuthContext();
	const showToast = useToast();

	// State for time_estimate and delay hour/minute fields
	const [timeEstimateHour, setTimeEstimateHour] = useState("");
	const [timeEstimateMinute, setTimeEstimateMinute] = useState("");
	const [timeTakenHour, setTimeTakenHour] = useState("");
	const [timeTakenMinute, setTimeTakenMinute] = useState("");
	const [delayHour, setDelayHour] = useState("");
	const [delayMinute, setDelayMinute] = useState("");
	const [estimateError, setEstimateError] = useState("");
	const [delayError, setDelayError] = useState("");
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			calendar_add: false,
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
			time_taken: "",
			delay: "",
			delay_reason: "",
			performance_rating: "",
			remarks: "",
			status: undefined,
		},
	});

	useEffect(() => {
		if (!isOpen) setUpdateData({});
	}, [isOpen]);

	useEffect(() => {
		if (updateData && users && categories) {
			const {
				calendar_add,
				title,
				description,
				assignee_id,
				category_id,
				expected_output,
				start_date,
				end_date,
				start_time,
				end_time,
				time_estimate,
				time_taken,
				delay,
				delay_reason,
				performance_rating,
				remarks,
				status,
			} = updateData;
			form.reset({
				calendar_add: calendar_add || false,
				title: title || "",
				description: description || "",
				assignee_id: assignee_id || undefined,
				category_id: category_id || undefined,
				expected_output: expected_output || "",
				start_date: start_date ? parseISO(start_date) : undefined,
				end_date: end_date ? parseISO(end_date) : undefined,
				start_time: start_time || "",
				end_time: end_time || "",
				time_estimate: time_estimate || "",
				time_taken: time_taken || "",
				delay: delay || "",
				delay_reason: delay_reason || "",
				performance_rating: performance_rating || "",
				remarks: remarks || "",
				status: status || undefined,
			});
			// Set hour/minute fields for time_estimate and delay
			if (typeof time_estimate === "number" || (typeof time_estimate === "string" && time_estimate !== "")) {
				const te = parseFloat(time_estimate);
				setTimeEstimateHour(Math.floor(te).toString());
				setTimeEstimateMinute(Math.round((te % 1) * 60).toString());
			} else {
				setTimeEstimateHour("");
				setTimeEstimateMinute("");
			}
			if (typeof time_taken === "number" || (typeof time_taken === "string" && time_taken !== "")) {
				const d = parseFloat(time_taken);
				setTimeTakenHour(Math.floor(d).toString());
				setTimeTakenMinute(Math.round((d % 1) * 60).toString());
			} else {
				setTimeTakenHour("");
				setTimeTakenMinute("");
			}
			if (typeof delay === "number" || (typeof delay === "string" && delay !== "")) {
				const d = parseFloat(delay);
				setDelayHour(Math.floor(d).toString());
				setDelayMinute(Math.round((d % 1) * 60).toString());
			} else {
				setDelayHour("");
				setDelayMinute("");
			}
		}
	}, [updateData, form, users, categories]);

	const handleSubmit = async (formData) => {
		setLoading(true);
		try {
			// Parse numeric fields
			const formatTime = (time) => {
				if (!time) return "";
				if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time;
				if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`;
				return time;
			};

			// Calculate decimal values for time_estimate and delay
			const timeEstimateDecimal =
				timeEstimateHour || timeEstimateMinute ? parseInt(timeEstimateHour || "0", 10) + parseInt(timeEstimateMinute || "0", 10) / 60 : undefined;
			const timeTakenDecimal =
				timeTakenHour || timeTakenMinute ? parseInt(timeTakenHour || "0", 10) + parseInt(timeTakenMinute || "0", 10) / 60 : undefined;
			const delayDecimal = delayHour || delayMinute ? parseInt(delayHour || "0", 10) + parseInt(delayMinute || "0", 10) / 60 : undefined;

			const parsedForm = {
				...formData,
				organization_id: user_auth.data.organization_id,
				start_date: formData.start_date ? format(formData.start_date, "yyyy-MM-dd") : null,
				end_date: formData.end_date ? format(formData.end_date, "yyyy-MM-dd") : null,
				start_time: formatTime(formData.start_time),
				end_time: formatTime(formData.end_time),
				time_estimate: timeEstimateDecimal !== undefined ? Number(timeEstimateDecimal.toFixed(2)) : undefined,
				time_taken: timeTakenDecimal !== undefined ? Number(timeTakenDecimal.toFixed(2)) : undefined,
				delay: delayDecimal !== undefined ? Number(delayDecimal.toFixed(2)) : undefined,
				performance_rating: formData.performance_rating ? parseInt(formData.performance_rating, 10) : null,
			};
			if (Object.keys(updateData).length === 0) {
				await axiosClient.post(`/task`, parsedForm);
				fetchData();
				showToast("Success!", "Task added.", 3000);
				setIsOpen(false);
			} else if (updateData?.calendar_add) {
				await axiosClient.post(`/task`, parsedForm);
				fetchData();
				showToast("Success!", "Task added to calendar.", 3000);
				setIsOpen(false);
				setTaskAdded(true);
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

	// Auto-suggest time estimate based on start and end time
	const calculateEstimate = () => {
		const { start_time, end_time } = form.getValues();
		if (start_time && end_time) {
			setEstimateError("");
			// Parse times as HH:mm or HH:mm:ss
			const parseTime = (t) => {
				const [h, m, s] = t.split(":").map(Number);
				return h * 60 + m + (s ? s / 60 : 0);
			};
			try {
				const startMin = parseTime(start_time);
				const endMin = parseTime(end_time);
				let diff = endMin - startMin;
				if (diff < 0) diff += 24 * 60; // handle overnight
				const hours = Math.floor(diff / 60);
				const minutes = Math.round(diff % 60);
				setTimeEstimateHour(hours.toString());
				setTimeEstimateMinute(minutes.toString());
			} catch (e) {
				setEstimateError("Invalid time format.");
			}
		} else {
			setEstimateError("Start and End Time is requred to calculate Estimate");
		}
	};
	// Auto-suggest delay time based on estimate and actual
	const calculateDelay = () => {
		if (timeEstimateHour && timeEstimateMinute && timeTakenHour && timeTakenMinute) {
			setDelayError("");
			// Parse times as HH:mm or HH:mm:ss
			const parseTime = (h, m) => {
				return h * 60 + m;
			};
			try {
				const estimate = parseTime(parseInt(timeEstimateHour), parseInt(timeEstimateMinute));
				const actual = parseTime(parseInt(timeTakenHour), parseInt(timeTakenMinute));
				let delay = actual - estimate;
				if (delay > 0) {
					setDelayHour(Math.floor(delay / 60) > 0 ? Math.floor(delay / 60).toString() : "0");
					setDelayMinute(Math.floor(delay % 60).toString());
				} else {
					setDelayHour("");
					setDelayMinute("");
				}
			} catch (e) {
				setDelayError("Invalid time format.");
			}
		} else {
			setDelayError("Estimate and Time Taken is requred to calculate Delay");
		}
	};

	const isEditable =
		user_auth?.data?.role === "Superadmin" ||
		user_auth?.data?.role === "Admin" ||
		user_auth?.data?.role === "Manager" ||
		Object.keys(updateData).length === 0 ||
		updateData?.calendar_add ||
		(updateData?.assignee_id === user_auth?.data?.id && user_auth?.data?.role === "Employee");
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
								<Select
									disabled={!isEditable}
									onValueChange={(value) => field.onChange(Number(value))}
									// defaultValue={updateData?.assignee_id || field.value} //this does not work on calendar modal form
									value={field.value ? field.value.toString() : undefined}
								>
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
					name="category_id"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Category</FormLabel>
								<Select
									disabled={!isEditable}
									onValueChange={(value) => field.onChange(Number(value))}
									value={field.value ? field.value.toString() : undefined}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a category">
												{field.value ? categories?.find((category) => category.id == field.value)?.name : "Select a category"}
											</SelectValue>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{Array.isArray(categories) && categories.length > 0 ? (
											categories.map((category) => (
												<SelectItem key={category.id} value={category.id.toString()}>
													{category.name}
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
					name="title"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input disabled={!isEditable} placeholder="Title" {...field} />
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
									<Textarea disabled={!isEditable} placeholder="Description" {...field} />
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
									<Textarea disabled={!isEditable} placeholder="Expected output" {...field} />
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
						return <DateInput disabled={!isEditable} field={field} label={"Start date"} placeholder={"Select start date"} />;
					}}
				/>
				<FormField
					control={form.control}
					name="end_date"
					render={({ field }) => {
						return <DateInput disabled={!isEditable} field={field} label={"End date"} placeholder={"Select end date"} />;
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
										disabled={!isEditable}
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
										disabled={!isEditable}
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
				{/* Time Estimate (hr/min) */}
				<FormItem>
					<FormLabel>Time Estimate</FormLabel>
					<div>
						<div className="flex flex-row justify-between gap-2">
							<div className="flex flex-row gap-2">
								<Input
									disabled={!isEditable}
									type="number"
									min="0"
									placeholder="hr"
									value={timeEstimateHour}
									onChange={(e) => {
										const val = e.target.value.replace(/[^0-9]/g, "");
										setTimeEstimateHour(val);
									}}
									className="w-20"
								/>
								<span>hr</span>
								<Input
									disabled={!isEditable}
									type="number"
									min="0"
									max="59"
									placeholder="min"
									value={timeEstimateMinute}
									onChange={(e) => {
										let val = e.target.value.replace(/[^0-9]/g, "");
										if (parseInt(val, 10) > 59) val = "59";
										setTimeEstimateMinute(val);
									}}
									className="w-20"
								/>
								<span>min</span>
							</div>
							<Button type="button" variant="ghost" className="w-fit" onClick={() => calculateEstimate()}>
								Auto Calculate
							</Button>
						</div>
						{estimateError !== "" ? <span className="text-destructive">{estimateError}</span> : ""}
					</div>
					<FormMessage />
				</FormItem>
				{/* Time Taken (hr/min) */}
				<FormItem>
					<FormLabel>Time Taken</FormLabel>
					<div className="flex gap-2">
						<Input
							disabled={!isEditable}
							type="number"
							min="0"
							placeholder="hr"
							value={timeTakenHour}
							onChange={(e) => {
								const val = e.target.value.replace(/[^0-9]/g, "");
								setTimeTakenHour(val);
							}}
							className="w-20"
						/>
						<span>hr</span>
						<Input
							disabled={!isEditable}
							type="number"
							min="0"
							max="59"
							placeholder="min"
							value={timeTakenMinute}
							onChange={(e) => {
								let val = e.target.value.replace(/[^0-9]/g, "");
								if (parseInt(val, 10) > 59) val = "59";
								setTimeTakenMinute(val);
							}}
							className="w-20"
						/>
						<span>min</span>
					</div>
					<FormMessage />
				</FormItem>
				<FormItem>
					<FormLabel>Delay</FormLabel>
					<div>
						<div className="flex flex-row gap-2">
							<div className="flex gap-2">
								<Input
									disabled={!isEditable}
									type="number"
									min="0"
									placeholder="hr"
									value={delayHour}
									onChange={(e) => {
										const val = e.target.value.replace(/[^0-9]/g, "");
										setDelayHour(val);
									}}
									className="w-20"
								/>
								<span>hr</span>
								<Input
									disabled={!isEditable}
									type="number"
									min="0"
									max="59"
									placeholder="min"
									value={delayMinute}
									onChange={(e) => {
										let val = e.target.value.replace(/[^0-9]/g, "");
										if (parseInt(val, 10) > 59) val = "59";
										setDelayMinute(val);
									}}
									className="w-20"
								/>
								<span>min</span>
							</div>

							<Button type="button" variant="ghost" className="w-fit" onClick={() => calculateDelay()}>
								Auto Calculate
							</Button>
						</div>
						{delayError !== "" ? <span className="text-destructive">{delayError}</span> : ""}
					</div>
				</FormItem>
				<FormField
					control={form.control}
					name="delay_reason"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Delay reason</FormLabel>
								<FormControl>
									<Textarea disabled={!isEditable} placeholder="Delay reason" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				{user_auth?.data?.role !== "Employee" && (
					<>
						<FormField
							control={form.control}
							name="performance_rating"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Rating &#40;1-10&#41;</FormLabel>
										<FormControl>
											<Input disabled={!isEditable} type="number" step="any" placeholder="Rating &#40;1-10&#41;" {...field} />
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
											<Textarea disabled={!isEditable} placeholder="Remarks" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
					</>
				)}
				<FormField
					control={form.control}
					name="status"
					render={({ field }) => {
						const statuses = [
							{ id: 1, name: "Pending" },
							{ id: 2, name: "In Progress" },
							{ id: 3, name: "For Review" },
							{ id: 4, name: "Completed" },
							{ id: 5, name: "Delayed" },
							{ id: 6, name: "On Hold" },
							{ id: 7, name: "Cancelled" },
						];
						return (
							<FormItem>
								<FormLabel>Status</FormLabel>
								<Select
									disabled={!isEditable}
									onValueChange={field.onChange}
									value={field.value || undefined}
									//  defaultValue={updateData?.status || field.value} //this does not work on calendar modal form
								>
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
				{isEditable ? (
					<Button type="submit" disabled={loading}>
						{loading && <Loader2 className="animate-spin mr-5 -ml-11 text-foreground" />}{" "}
						{Object.keys(updateData).length === 0 || updateData?.calendar_add ? "Submit" : "Update"}
					</Button>
				) : (
					""
				)}
			</form>
		</Form>
	);
}
