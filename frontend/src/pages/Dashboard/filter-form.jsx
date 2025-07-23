"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import axiosClient from "@/axios.client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/contexts/ToastContextProvider";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import DateInput from "@/components/form/DateInput";
import { set } from "date-fns";
import { useEffect, useState } from "react";
import { MultiSelect } from "@/components/ui/multi-select";

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

export default function FilterForm({ setIsOpen, setReports, filters, setFilters, userId = null, users }) {
	const { loading, setLoading } = useLoadContext();
	const showToast = useToast();
	const [selectedUsers, setSelectedUsers] = useState([]);
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			from: undefined,
			to: undefined,
		},
	});
	useEffect(() => {
		if (filters.values) {
			const fromStr = filters.values["Date Range"]?.split(" to ")[0] || undefined;
			const toStr = filters.values["Date Range"]?.split(" to ")[1] || undefined;
			const from = fromStr ? new Date(fromStr) : undefined;
			const to = fromStr ? new Date(toStr) : undefined;
			form.reset({
				from: from ?? undefined,
				to: to ?? undefined,
			});
		}
	}, [filters, form]);

	const handleSubmit = async (form_filter) => {
		setLoading(true);
		try {
			const from = form_filter?.from ? form_filter.from.toLocaleDateString("en-CA") : "";
			const to = form_filter?.to ? form_filter.to.toLocaleDateString("en-CA") : "";
			const selected_users = form_filter?.selected_users || []; // this only gets the IDs of selected users
			const selectedUserObjects = users?.filter((u) => selected_users.includes(u.value)); // this maps the IDs to user objects
			// console.log(selectedUserObjects);
			// setSelectedUsers(selectedUserObjects);
			let filteredReports;
			if (!userId) {
				filteredReports = await axiosClient.get(`/dashboard?from=${from}&to=${to}&users=${selected_users.join(",")}`);
			} else {
				filteredReports = await axiosClient.get(`/user/${userId}/reports?from=${from}&to=${to}`);
			}
			setFilters({
				values: {
					"Date Range": `${from && to ? from + " to " + to : ""}`,
					Members: selectedUserObjects?.map((u) => u.value).join(", ") || "",
				},
				display: {
					"Date Range": `${from && to ? from + " to " + to : ""}`,
					Members: selectedUserObjects?.map((u) => u.label).join(", ") || "",
				},
			});
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
					handleSubmit({ ...form_filter, selected_users: selectedUsers });
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
				<FormField
					control={form.control}
					name="selected_users"
					render={({ field }) => {
						return (
							<FormItem>
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
				<Button
					type="submit"
					disabled={loading || ((!form.watch("from") || !form.watch("to")) && selectedUsers.length === 0)}
					className="w-full"
					variant="default"
				>
					{loading && <Loader2 className="animate-spin mr-5 -ml-11 text-foreground" />} Apply Filter
				</Button>
			</form>
		</Form>
	);
}
