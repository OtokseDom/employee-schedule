import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-child";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover-child";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parse } from "date-fns";
import { DialogClose } from "@radix-ui/react-dialog";

export default function ScheduleForm({ form, modalData, events, loading, selectedScheduleId, handleTimeChange, handleSubmit, handleDelete }) {
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4 max-w-md w-full">
				<FormField
					control={form.control}
					name="event_id"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Event</FormLabel>
								<Select modal={true} onValueChange={field.onChange} defaultValue={modalData?.event_id || field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select an event">
												{field.value ? events.find((event) => event?.id == field.value)?.name : "Select an event"}
											</SelectValue>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{Array.isArray(events) && events.length > 0 ? (
											events?.map((event) => (
												<SelectItem key={event?.id} value={event?.id}>
													{event?.name}
												</SelectItem>
											))
										) : (
											<SelectItem disabled>No events available</SelectItem>
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
					name="shift_start"
					render={({ field }) => {
						const parsedTime = field.value ? parse(field.value, "HH:mm:ss", new Date()) : null;
						return (
							<FormItem>
								<FormLabel>Shift Start</FormLabel>
								<Popover modal={true}>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={"outline"}
												className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
											>
												{field.value ? format(parsedTime, "hh:mm aa") : <span>hh:mm</span>}
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
																		type="button"
																		key={hour}
																		size="icon"
																		variant={field.value && parsedTime.getHours() === hour ? "default" : "ghost"}
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
																	type="button"
																	key={minute}
																	size="icon"
																	variant={field.value && parsedTime.getMinutes() === minute ? "default" : "ghost"}
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
						const parsedTime = field.value ? parse(field.value, "HH:mm:ss", new Date()) : null;
						return (
							<FormItem>
								<FormLabel>Shift End</FormLabel>
								<Popover modal={true}>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={"outline"}
												className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
											>
												{field.value ? format(parsedTime, "hh:mm aa") : <span>hh:mm</span>}
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
																		type="button"
																		key={hour}
																		size="icon"
																		variant={field.value && parsedTime.getHours() === hour ? "default" : "ghost"}
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
																	type="button"
																	key={minute}
																	size="icon"
																	variant={field.value && parsedTime.getMinutes() === minute ? "default" : "ghost"}
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
				<FormField
					control={form.control}
					name="status"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Status</FormLabel>
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a Status">{field.value ?? "Select a status"}</SelectValue>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="Pending" className="text-yellow-300">
											Pending
										</SelectItem>
										<SelectItem value="In Progress" className="text-blue-300">
											In Progress
										</SelectItem>
										<SelectItem value="Completed" className="text-green-300">
											Completed
										</SelectItem>
										<SelectItem value="Cancelled" className="text-red-300">
											Cancelled
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<div className="flex justify-between">
					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Cancel
						</Button>
					</DialogClose>
					<div className="flex gap-2">
						{loading && <Loader2 className="animate-spin mr-5 -ml-11 text-foreground" />}
						{selectedScheduleId && (
							<Button onClick={handleDelete} type="button" variant="destructive" disabled={loading}>
								Delete
							</Button>
						)}
						<Button type="submit" disabled={loading}>
							Submit
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
