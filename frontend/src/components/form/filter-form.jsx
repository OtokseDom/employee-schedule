"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import axiosClient from "@/axios.client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/contexts/ToastContextProvider";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import DateInput from "@/components/form/DateInput";
import { set } from "date-fns";
import { useEffect, useState } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import { API } from "@/constants/api";

const formSchema = z
	.object({
		from: z.date().optional(),
		to: z.date().optional(),
	})
	.refine(
		(data) => {
			const hasFrom = !!data.from;
			const hasTo = !!data.to;
			return (hasFrom && hasTo) || (!hasFrom && !hasTo);
		},
		{
			message: "Both 'From' and 'To' dates are required if one is provided.",
			path: ["from"],
		}
	)
	.refine(
		(data) => {
			if (data.from && data.to) {
				return data.from <= data.to;
			}
			return true;
		},
		{
			message: "'From' date must be earlier or equal to 'To' date.",
			path: ["from"],
		}
	);

export default function FilterForm({
	setIsOpen,
	userId = null,
	setReports,
	projects,
	users,
	filters,
	setFilters,
	selectedProjects,
	setSelectedProjects,
	selectedUsers,
	setSelectedUsers,
}) {
	const { loading, setLoading } = useLoadContext();
	const showToast = useToast();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			from: undefined,
			to: undefined,
		},
	});

	useEffect(() => {
		// Populating form when has active filter values
		if (filters.values) {
			const fromStr = filters.values["Date Range"]?.split(" to ")[0] || undefined;
			const toStr = filters.values["Date Range"]?.split(" to ")[1] || undefined;
			const from = fromStr ? new Date(fromStr) : undefined;
			const to = fromStr ? new Date(toStr) : undefined;
			// const project_id = filters.values["Project"];
			// Projects
			const projectsRaw = filters.values["Projects"];
			const projectIds = Array.isArray(projectsRaw)
				? projectsRaw.map((id) => parseInt(id))
				: typeof projectsRaw === "string"
				? projectsRaw
						?.split(",")
						.map((id) => parseInt(id.trim()))
						.filter((id) => !isNaN(id)) // to avoid [NaN] when projectsRaw is empty or non numeric
				: [];
			setSelectedProjects(projectIds); // crucial
			// Users
			if (!userId) {
				const membersRaw = filters.values["Members"];
				const userIds = Array.isArray(membersRaw)
					? membersRaw.map((id) => parseInt(id))
					: typeof membersRaw === "string"
					? membersRaw
							?.split(",")
							.map((id) => parseInt(id.trim()))
							.filter((id) => !isNaN(id)) // to avoid [NaN] when membersRaw is empty or non numeric
					: [];
				setSelectedUsers(userIds); // crucial
			}
			form.reset({
				from: from ?? undefined,
				to: to ?? undefined,
				// project_id: project_id ?? undefined,
			});
		}
	}, [filters, form]);

	const handleSubmit = async (form_filter) => {
		setLoading(true);
		try {
			const from = form_filter?.from ? form_filter.from.toLocaleDateString("en-CA") : "";
			const to = form_filter?.to ? form_filter.to.toLocaleDateString("en-CA") : "";
			// const project = form_filter.project_id ? projects?.find((project) => project.id == form_filter.project_id) : "";
			const selected_projects = form_filter?.selected_projects || []; // this only gets the IDs of selected projects
			const selectedProjectObjects = projects?.filter((p) => selected_projects.includes(p.value)); // this maps the IDs to project objects
			const selected_users = form_filter?.selected_users || []; // this only gets the IDs of selected users
			const selectedUserObjects = users?.filter((u) => selected_users.includes(u.value)); // this maps the IDs to user objects
			let filteredReports;
			if (!userId) {
				filteredReports = await axiosClient.get(API().dashboard(from, to, selected_users.join(","), selected_projects.join(",")));
				setFilters({
					values: {
						"Date Range": `${from && to ? from + " to " + to : ""}`,
						Members: selectedUserObjects?.map((u) => u.value).join(", ") || "",
						Projects: selectedProjectObjects?.map((p) => p.value).join(", ") || "",
					},
					display: {
						"Date Range": `${from && to ? from + " to " + to : ""}`,
						Members: selectedUserObjects?.map((u) => u.label).join(", ") || "",
						Projects: selectedProjectObjects?.map((p) => p.label).join(", ") || "",
					},
				});
			} else {
				filteredReports = await axiosClient.get(API().user_reports(userId, from, to, selected_projects.join(",")));
				setFilters({
					values: {
						"Date Range": `${from && to ? from + " to " + to : ""}`,
						Projects: selectedProjectObjects?.map((p) => p.value).join(", ") || "",
					},
					display: {
						"Date Range": `${from && to ? from + " to " + to : ""}`,
						Projects: selectedProjectObjects?.map((p) => p.label).join(", ") || "",
					},
				});
			}
			setReports(filteredReports.data.data);
			showToast("Success!", "Filtered report fetched.", 3000);
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 3000, "fail");
			console.error("Error fetching data:", e);
		} finally {
			setLoading(false);
			setIsOpen(false);
		}
	};
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((form_filter) => {
					// Include selectedUsers in the filter object
					handleSubmit({ ...form_filter, selected_users: selectedUsers, selected_projects: selectedProjects });
				})}
				className="flex flex-col gap-4 max-w-md w-full"
			>
				<div className="flex flex-row justify-between gap-4">
					<FormField
						control={form.control}
						name="from"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<DateInput field={field} label={"From"} placeholder={"Select date"} />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="to"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<DateInput field={field} label={"To"} placeholder={"Select date"} />
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
				{/* <FormField
					control={form.control}
					name="project_id"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Project</FormLabel>
								<Select onValueChange={(value) => field.onChange(Number(value))} value={field.value ? field.value.toString() : undefined}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a project">
												{field.value ? projects?.find((project) => project.id == field.value)?.title : "Select a project"}
											</SelectValue>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{Array.isArray(projects) && projects.length > 0 ? (
											projects.map((project) => (
												<SelectItem key={project.id} value={project.id.toString()}>
													{project.title}
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
				/> */}
				<FormField
					control={form.control}
					name="selected_projects"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Projects</FormLabel>
								<FormControl>
									<MultiSelect
										field={field}
										options={projects || []}
										onValueChange={setSelectedProjects}
										defaultValue={selectedProjects}
										placeholder="Select projects"
										variant="inverted"
										animation={2}
										maxCount={3}
									/>
								</FormControl>
							</FormItem>
						);
					}}
				/>
				{!userId && (
					<FormField
						control={form.control}
						name="selected_users"
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel>Members</FormLabel>
									<FormControl>
										<MultiSelect
											field={field}
											options={users || []}
											onValueChange={setSelectedUsers}
											defaultValue={selectedUsers}
											placeholder="Select users"
											variant="inverted"
											animation={2}
											maxCount={3}
										/>
									</FormControl>
								</FormItem>
							);
						}}
					/>
				)}
				<Button
					type="submit"
					disabled={
						loading ||
						((!form.watch("from") || !form.watch("to")) &&
							(selectedUsers?.length === 0 || !selectedUsers) &&
							(selectedProjects?.length === 0 || !selectedProjects))
					}
					className="w-full"
					variant="default"
				>
					{loading && <Loader2 className="animate-spin mr-5 -ml-11 text-background" />} Apply Filter
				</Button>
			</form>
		</Form>
	);
}
