"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import DateInput from "@/components/form/DateInput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axiosClient from "@/axios.client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/contexts/ToastContextProvider";
import { useEffect } from "react";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { useAuthContext } from "@/contexts/AuthContextProvider";
import { API } from "@/constants/api";
import { format, parseISO } from "date-fns";
import { useProjectsStore } from "@/store/projects/projectsStore";

const formSchema = z.object({
	title: z.string().refine((data) => data.trim() !== "", {
		message: "Title is required.",
	}),
	description: z.string().optional(),
	target_date: z.date().optional(),
	estimated_date: z.date().optional(),
	remarks: z.string().optional(),
	priority: z.string({
		required_error: "Priority is required.",
	}),
	status: z.string({
		required_error: "Status is required.",
	}),
});

export default function ProjectForm({ setIsOpen, updateData, setUpdateData }) {
	const { user } = useAuthContext();
	const { loading, setLoading } = useLoadContext();
	const showToast = useToast();
	const { addProject, updateProject } = useProjectsStore([]);
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			target_date: undefined,
			estimated_date: undefined,
			priority: "",
			remarks: "",
			status: undefined,
		},
	});

	useEffect(() => {
		if (updateData) {
			const { title, description, target_date, estimated_date, priority, remarks, status } = updateData;
			form.reset({
				title: title || "",
				description: description || "",
				target_date: target_date ? parseISO(target_date) : undefined,
				estimated_date: estimated_date ? parseISO(target_date) : undefined,
				priority: priority || "",
				remarks: remarks || "",
				status: status || undefined,
			});
		}
	}, [updateData, form]);

	const handleSubmit = async (form) => {
		setLoading(true);
		try {
			const parsedForm = {
				...form,
				organization_id: user.data.organization_id,
				target_date: form.target_date ? format(form.target_date, "yyyy-MM-dd") : null,
				estimated_date: form.estimated_date ? format(form.estimated_date, "yyyy-MM-dd") : null,
			};
			if (Object.keys(updateData).length === 0) {
				const projectResponse = await axiosClient.post(API().project(), parsedForm);
				addProject(projectResponse.data.data);
				showToast("Success!", "Project added.", 3000);
			} else {
				const projectResponse = await axiosClient.put(API().project(updateData?.id), parsedForm);
				updateProject(updateData?.id, projectResponse.data.data);
				showToast("Success!", "Project updated.", 3000);
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
					name="title"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input placeholder="Project title" {...field} />
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
					name="target_date"
					render={({ field }) => {
						return <DateInput field={field} label={"Target date"} placeholder={"Select target date"} />;
					}}
				/>
				<FormField
					control={form.control}
					name="estimated_date"
					render={({ field }) => {
						return <DateInput field={field} label={"Estimated date"} placeholder={"Select estimated date"} />;
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
					name="priority"
					render={({ field }) => {
						const priorities = [
							{ id: 1, name: "Low" },
							{ id: 2, name: "Medium" },
							{ id: 3, name: "High" },
							{ id: 4, name: "Urgent" },
							{ id: 5, name: "Critical" },
						];
						return (
							<FormItem>
								<FormLabel>Priority *</FormLabel>
								<Select onValueChange={field.onChange} value={field.value || undefined}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select priority"></SelectValue>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{Array.isArray(priorities) && priorities.length > 0 ? (
											priorities?.map((priority) => (
												<SelectItem key={priority?.id} value={priority?.name}>
													{priority?.name}
												</SelectItem>
											))
										) : (
											<SelectItem disabled>No priority available</SelectItem>
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
								<FormLabel>Status *</FormLabel>
								<Select onValueChange={field.onChange} value={field.value || undefined}>
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
					{loading && <Loader2 className="animate-spin mr-5 -ml-11 text-background" />} {Object.keys(updateData).length === 0 ? "Submit" : "Update"}
				</Button>
			</form>
		</Form>
	);
}
