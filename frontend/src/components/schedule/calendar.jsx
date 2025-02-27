import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, subMonths, addMonths, startOfYear, endOfYear, eachMonthOfInterval } from "date-fns";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Calendar
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useMemo, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Label } from "../ui/label";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import { Skeleton } from "../ui/skeleton";
import CalendarCell from "./CalendarCell";
// import { toast } from "sonner";

const formSchema = z.object({
	employee: z.number(),
	event: z.number(),
	shift_start: z.date(),
	shift_end: z.date(),
});

export default function CalendarSchedule({ employees, events, schedules, loading }) {
	// TODO: opening modal not getting schdule data

	const [currentMonth, setCurrentMonth] = useState(new Date());
	// const [schedules, setSchedules] = useState(sampleSchedules);
	const [selectedDate, setSelectedDate] = useState(null);
	const [modalData, setModalData] = useState({ employee: 0, event: 0, shift_start: undefined, shift_end: undefined });
	const [hoveredEvent, setHoveredEvent] = useState(null);
	const startDate = startOfWeek(startOfMonth(currentMonth));
	const endDate = endOfWeek(endOfMonth(currentMonth));

	const days = [];
	let day = startDate;
	while (day <= endDate) {
		days.push(day);
		day = addDays(day, 1);
	}

	const matchingSchedule = (date) => {
		if (Array.isArray(schedules)) {
			return schedules.find((schedule) => format(schedule.date, "yyyy-MM-dd") === date);
		}
		return null;
	};

	const openModal = (date) => {
		console.log(modalData);
		setSelectedDate(date);
		setModalData(schedules[date] || { employee: 0, event: 0, shift_start: undefined, shift_end: undefined });
	};

	const closeModal = () => {
		setSelectedDate(null);
		setModalData({ employee: 0, event: 0, shift_start: undefined, shift_end: undefined });
	};

	// Calendar Input
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			employee: modalData?.employee || 0,
			event: modalData?.event || 0,
			shift_start: modalData?.shift_start || undefined,
			shift_end: modalData?.shift_end || undefined,
		},
	});

	useEffect(() => {
		form.reset({
			employee: modalData?.employee || 0,
			event: modalData?.event || 0,
			shift_start: modalData?.shift_start || undefined,
			shift_end: modalData?.shift_end || undefined,
		});
	}, [modalData, form]);

	const handleTimeChange = (type, value, field) => {
		const currentDate = form.getValues(field) || new Date();
		let newDate = new Date(currentDate);

		if (type === "hour") {
			const hour = parseInt(value, 10);
			newDate.setHours(hour);
		} else if (type === "minute") {
			newDate.setMinutes(parseInt(value, 10));
		}

		form.setValue(field, newDate);
	};

	const handleSubmit = (form) => {
		console.log({ ...form });
	};

	return (
		<div className="p-1 md:p-4 max-w-3xl mx-auto mt-5">
			<div className="flex justify-between mb-4">
				<button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 border rounded">
					Prev
				</button>
				<h2 className="text-xl font-bold text-center">{format(currentMonth, "MMMM yyyy")}</h2>
				<button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 border rounded">
					Next
				</button>
			</div>
			<div className="bg-background text-foreground grid grid-cols-7 gap-0 md:gap-1  rounded-lg p-2 md:p-8 mt-10 text-xs sm:text-base">
				{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
					<div key={d} className="text-center font-semibold my-4">
						{d}
					</div>
				))}
				{days.map((date, index) => {
					const formattedSchedules = matchingSchedule(format(date, "yyyy-MM-dd"));
					const status = formattedSchedules?.status;
					let color = "";

					switch (status) {
						case "Pending":
							color = "yellow";
							break;
						case "In Progress":
							color = "blue";
							break;
						case "Completed":
							color = "green";
							break;
						case "Cancelled":
							color = "red";
							break;
						default:
							color = "gray";
							break;
					}
					return (
						<CalendarCell
							key={index}
							color={color}
							loading={loading}
							formattedSchedules={formattedSchedules}
							hoveredEvent={hoveredEvent}
							setHoveredEvent={setHoveredEvent}
							openModal={openModal}
							date={date}
						/>
					);
				})}
			</div>

			{selectedDate && (
				<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
					<div className="bg-background p-6 rounded shadow-lg w-full max-w-md">
						<h3 className="text-lg font-bold mb-2">Event on {selectedDate}</h3>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4 max-w-md w-full">
								<FormField
									control={form.control}
									name="employee"
									render={({ field }) => {
										return (
											<FormItem>
												<FormLabel>Employee</FormLabel>
												<Select onValueChange={field.onChange} defaultValue={field.value}>
													<FormControl>
														<SelectTrigger>
															{/* <SelectValue placeholder="Select an employee" /> */}
															<SelectValue placeholder="Select an employee">
																{modalData.employee && !field.value
																	? employees.find((emp) => emp.id == modalData.employee)?.name
																	: field.value
																	? employees.find((emp) => emp.id == field.value)?.name
																	: "Select an employee"}
															</SelectValue>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{Array.isArray(employees) && employees.length > 0 ? (
															employees?.map((employee) => (
																<SelectItem key={employee.id} value={employee.id}>
																	{employee.name}
																</SelectItem>
															))
														) : (
															<SelectItem disabled>No employees available</SelectItem>
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
									name="event"
									render={({ field }) => {
										return (
											<FormItem>
												<FormLabel>Event</FormLabel>
												<FormControl>
													<Textarea placeholder="Event" {...field} value={field.value ?? ""} />
												</FormControl>
												<FormMessage />
											</FormItem>
										);
									}}
								/>
								<FormField
									control={form.control}
									name="shift_start"
									render={({ field }) => {
										return (
											<FormItem>
												<FormLabel>Shift Start</FormLabel>
												<Popover>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																variant={"outline"}
																className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
															>
																{field.value ? format(field.value, "hh:mm aa") : <span>hh:mm</span>}
																<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0" align="start">
														<div className="sm:flex">
															<div className="flex sm:flex-col">
																<div className="hidden md:flex justify-between py-6">
																	<div className="w-full flex flex-row sm:flex-col items-center">
																		<Label>Hour</Label>
																	</div>
																	<div className="w-full flex flex-row sm:flex-col items-center">
																		<Label>Minute</Label>
																	</div>
																</div>
																<div className="flex flex-col sm:flex-row sm:h-[300px] border-t divide-y sm:divide-y-0 sm:divide-x">
																	<ScrollArea className="w-64 sm:w-auto">
																		<div className="flex sm:flex-col p-2">
																			{Array.from({ length: 24 }, (_, i) => i)
																				.reverse()
																				.map((hour) => (
																					<Button
																						key={hour}
																						size="icon"
																						variant={
																							field.value && field.value.getHours() === hour ? "default" : "ghost"
																						}
																						className="sm:w-full shrink-0 aspect-square"
																						onClick={() => handleTimeChange("hour", hour.toString(), "shift_start")}
																					>
																						{hour}
																					</Button>
																				))}
																		</div>
																		<ScrollBar orientation="horizontal" className="sm:hidden" />
																	</ScrollArea>
																	<ScrollArea className="w-64 sm:w-auto">
																		<div className="flex sm:flex-col p-2">
																			{Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
																				<Button
																					key={minute}
																					size="icon"
																					variant={
																						field.value && field.value.getMinutes() === minute ? "default" : "ghost"
																					}
																					className="sm:w-full shrink-0 aspect-square"
																					onClick={() => handleTimeChange("minute", minute.toString(), "shift_start")}
																				>
																					{minute.toString().padStart(2, "0")}
																				</Button>
																			))}
																		</div>
																		<ScrollBar orientation="horizontal" className="sm:hidden" />
																	</ScrollArea>
																</div>
															</div>
														</div>
													</PopoverContent>
												</Popover>
												<FormMessage />
											</FormItem>
										);
									}}
								/>
								<FormField
									control={form.control}
									name="shift_end"
									render={({ field }) => {
										return (
											<FormItem>
												<FormLabel>Shift End</FormLabel>
												<Popover>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																variant={"outline"}
																className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
															>
																{field.value ? format(field.value, "hh:mm aa") : <span>hh:mm</span>}
																<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0" align="start">
														<div className="sm:flex">
															<div className="flex sm:flex-col">
																<div className="hidden md:flex justify-between py-6">
																	<div className="w-full flex flex-row sm:flex-col items-center">
																		<Label>Hour</Label>
																	</div>
																	<div className="w-full flex flex-row sm:flex-col items-center">
																		<Label>Minute</Label>
																	</div>
																</div>
																<div className="flex flex-col sm:flex-row sm:h-[300px] border-t divide-y sm:divide-y-0 sm:divide-x">
																	<ScrollArea className="w-64 sm:w-auto">
																		<div className="flex sm:flex-col p-2">
																			{Array.from({ length: 24 }, (_, i) => i)
																				.reverse()
																				.map((hour) => (
																					<Button
																						key={hour}
																						size="icon"
																						variant={
																							field.value && field.value.getHours() === hour ? "default" : "ghost"
																						}
																						className="sm:w-full shrink-0 aspect-square"
																						onClick={() => handleTimeChange("hour", hour.toString(), "shift_end")}
																					>
																						{hour}
																					</Button>
																				))}
																		</div>
																		<ScrollBar orientation="horizontal" className="sm:hidden" />
																	</ScrollArea>
																	<ScrollArea className="w-64 sm:w-auto">
																		<div className="flex sm:flex-col p-2">
																			{Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
																				<Button
																					key={minute}
																					size="icon"
																					variant={
																						field.value && field.value.getMinutes() === minute ? "default" : "ghost"
																					}
																					className="sm:w-full shrink-0 aspect-square"
																					onClick={() => handleTimeChange("minute", minute.toString(), "shift_end")}
																				>
																					{minute.toString().padStart(2, "0")}
																				</Button>
																			))}
																		</div>
																		<ScrollBar orientation="horizontal" className="sm:hidden" />
																	</ScrollArea>
																</div>
															</div>
														</div>
													</PopoverContent>
												</Popover>
												<FormMessage />
											</FormItem>
										);
									}}
								/>
								<div className="flex justify-between">
									<Button onClick={closeModal} type="button" variant="secondary">
										Cancel
									</Button>
									<Button type="submit">Submit</Button>
								</div>
							</form>
						</Form>
					</div>
				</div>
			)}
		</div>
	);
}
