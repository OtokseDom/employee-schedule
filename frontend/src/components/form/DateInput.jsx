import { useEffect, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, startOfYear, endOfYear, eachMonthOfInterval, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default function DateInput({ field, label, placeholder, disableFuture = false }) {
	/* -------------------------------------------------------------------------- */
	/*                                 Date field                                 */
	/* -------------------------------------------------------------------------- */
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
	/* ------------------------------------ end date field ----------------------------------- */
	return (
		<FormItem>
			<FormLabel>{label}</FormLabel>
			<Popover>
				<PopoverTrigger asChild>
					<FormControl>
						<Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
							{field.value ? format(field.value, "PPP") : <span>{placeholder}</span>}
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
						className={"pointer-events-auto"} //added to fix the issue with calendar not being clickable
						// modal={true}
						selected={date}
						onSelect={(date) => field.onChange(date)}
						month={new Date(year, month)}
						onMonthChange={(newMonth) => {
							setMonth(newMonth.getMonth());
							setYear(newMonth.getFullYear());
						}}
						disabled={(disableFuture ? (date) => date > new Date() : "") || date < new Date("2000-01-01")}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
			<FormMessage />
		</FormItem>
	);
}
