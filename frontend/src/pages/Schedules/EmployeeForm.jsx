"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Calendar
import { format, startOfYear, endOfYear, eachMonthOfInterval, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/contexts/ToastContextProvider";
import axiosClient from "@/axios.client";

const formSchema = z.object({
	name: z.string({
		required_error: "Name is required.",
	}),
	position: z.string({
		required_error: "Position is required.",
	}),
	dob: z.date({
		required_error: "Birthday is required.",
	}),
});

export default function EmployeeForm({ data, setEmployees, loading, setLoading, setIsOpen, updateData, setUpdateData }) {
	const showToast = useToast();
	const [date, setDate] = useState();
	const [month, setMonth] = useState(date ? date.getMonth() : new Date().getMonth());
	const [year, setYear] = useState(date ? date.getFullYear() : new Date().getFullYear());

	const years = useMemo(() => {
		const currentYear = new Date().getFullYear();
		return Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
	}, []);

	const months = useMemo(() => {
		if (year) {
			return eachMonthOfInterval({
				start: startOfYear(new Date(year, 0, 1)),
				end: endOfYear(new Date(year, 0, 1)),
			});
		}
		return [];
	}, [year]);

	useEffect(() => {
		if (date) {
			setMonth(date.getMonth());
			setYear(date.getFullYear());
		}
	}, [date]);

	const handleYearChange = (selectedYear) => {
		const newYear = parseInt(selectedYear, 10);
		setYear(newYear);
		if (date) {
			const newDate = new Date(date);
			newDate.setFullYear(newYear);
			setDate(newDate);
		}
	};

	const handleMonthChange = (selectedMonth) => {
		const newMonth = parseInt(selectedMonth, 10);
		setMonth(newMonth);
		if (date) {
			const newDate = new Date(date);
			newDate.setMonth(newMonth);
			setDate(newDate);
		} else {
			setDate(new Date(year, newMonth, 1));
		}
	};

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			position: "",
			dob: undefined,
		},
	});

	useEffect(() => {
		if (updateData) {
			const { name, position, dob } = updateData;
			form.reset({
				name,
				position,
				dob: dob ? parseISO(dob) : undefined,
			});
			setDate(dob ? parseISO(dob) : undefined);
		}
	}, [updateData, form]);

	const handleSubmit = async (form) => {
		const formattedData = {
			...form,
			dob: form.dob ? format(form.dob, "yyyy-MM-dd") : null, // Format to Y-m-d
		};
		setLoading(true);
		try {
			if (!updateData) {
				const employeeResponse = await axiosClient.post(`/employee`, formattedData);
				const addedEmployee = employeeResponse.data;
				// Insert added employee in employees array
				const updatedEmployees = [addedEmployee, ...data];
				setEmployees(updatedEmployees);
				showToast("Success!", "Employee added.", 3000);
			} else {
				const employeeResponse = await axiosClient.put(`/employee/${updateData?.id}`, formattedData);
				const addedEmployee = employeeResponse.data;
				// Insert added employee in employees array
				const updatedEmployees = [addedEmployee, ...data];
				setEmployees(updatedEmployees);
				showToast("Success!", "Employee updated.", 3000);
			}
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 3000);
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
									<Input placeholder="Employee name" {...field} />
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
									<Input placeholder="Employee position" {...field} />
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
						return (
							<FormItem>
								<FormLabel>Birthday</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={"outline"}
												className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
											>
												{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<div className="flex justify-between p-2 space-x-1">
											<Select onValueChange={handleYearChange} value={year.toString()}>
												<SelectTrigger className="w-[120px]">
													<SelectValue placeholder="Year" />
												</SelectTrigger>
												<SelectContent>
													{years.map((y) => (
														<SelectItem key={y} value={y.toString()}>
															{y}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<Select onValueChange={handleMonthChange} value={month.toString()}>
												<SelectTrigger className="w-[120px]">
													<SelectValue placeholder="Month" />
												</SelectTrigger>
												<SelectContent>
													{months.map((m, index) => (
														<SelectItem key={index} value={index.toString()}>
															{format(m, "MMMM")}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										<Calendar
											mode="single"
											selected={date}
											onSelect={(date) => field.onChange(date)}
											month={new Date(year, month)}
											onMonthChange={(newMonth) => {
												setMonth(newMonth.getMonth());
												setYear(newMonth.getFullYear());
											}}
											disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<Button type="submit" disabled={loading}>
					{loading && <Loader2 className="animate-spin mr-5 -ml-11 text-foreground" />} {updateData ? "Update" : "Submit"}
				</Button>
			</form>
		</Form>
	);
}
