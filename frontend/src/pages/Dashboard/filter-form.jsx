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

export default function FilterForm({ setIsOpen, setReports, setFilters }) {
	const { loading, setLoading } = useLoadContext();
	const showToast = useToast();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			from: undefined,
			to: undefined,
		},
	});

	const handleSubmit = async (filter) => {
		setLoading(true);
		try {
			// TODO: Add filter parameter in dashboard report controller
			const from = filter?.from ? filter.from.toISOString().slice(0, 10) : "";
			const to = filter?.to ? filter.to.toISOString().slice(0, 10) : "";

			const filteredReports = await axiosClient.get(`/dashboard?from=${from}&to=${to}`);
			const formatDate = (dateStr) => {
				if (!dateStr) return "";
				const date = new Date(dateStr);
				return date.toLocaleDateString("en-US", {
					year: "numeric",
					month: "short",
					day: "numeric",
				});
			};

			setFilters({
				"Date Range": `${formatDate(from)} to ${formatDate(to)}`,
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
			<form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4 max-w-md w-full">
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
				<Button type="submit" disabled={loading || !form.watch("from") || !form.watch("to")}>
					{loading && <Loader2 className="animate-spin mr-5 -ml-11 text-foreground" />} Submit
				</Button>
			</form>
		</Form>
	);
}
