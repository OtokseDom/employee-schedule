"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Calendar
import { format, startOfYear, endOfYear, eachMonthOfInterval } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useMemo, useState } from "react";

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

export default function EmployeeForm({ setEmployees }) {
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

	const handleSubmit = async (form) => {
		setLoading(true);
		try {
			const employeeResponse = await axiosClient.post(`/employee`, form).data;
			const updatedSchedule = scheduleResponse.data;
			setSchedules(updatedSchedules);
			setMessage({ message: "Successfully Updated!" });
		} catch (e) {
			setMessage({ code: e.status, message: e.response?.data?.message });
			console.error("Error fetching data:", e);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
		// Reset the message after 5 seconds
		setTimeout(() => {
			setMessage({ code: null, message: null });
		}, 5000); // 5000 milliseconds = 5 seconds
		console.log({ ...form });
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
										{/* <Calendar
											mode="single"
											selected={field.value}
											onSelect={(date) => field.onChange(date)}
											disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
											initialFocus
										/> */}
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
