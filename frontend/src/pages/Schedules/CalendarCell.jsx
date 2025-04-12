import React from "react";
import { Skeleton } from "../../components/ui/skeleton";
import { format, parse } from "date-fns";
import { useLoadContext } from "@/contexts/LoadContextProvider";

function CellContent({ colorClass, textColorClass, formattedSchedules, date, hoveredEvent, setHoveredEvent, loading }) {
	const shiftStart = formattedSchedules?.shift_start ? parse(formattedSchedules.shift_start, "HH:mm:ss", new Date()) : null;
	const shiftEnd = formattedSchedules?.shift_end ? parse(formattedSchedules.shift_end, "HH:mm:ss", new Date()) : null;

	return (
		<div
			className={`${colorClass} ${textColorClass} border border-gray-200 p-2 h-24 sm:h-24 cursor-pointer hover:bg-secondary rounded-lg relative`}
			onMouseEnter={() => setHoveredEvent(formattedSchedules)}
			onMouseLeave={() => setHoveredEvent(null)}
		>
			{loading ? (
				<div className="flex flex-col space-y-1 md:space-y-3 w-full">
					<div className="flex flex-row justify-between gap-1">
						<Skeleton className="h-4 w-full md:w-1/5" />
						<Skeleton className="h-4 w-full md:w-3/5" />
					</div>
					<Skeleton className="h-4 md:w-full" />
					<Skeleton className="h-4 md:w-full" />
				</div>
			) : (
				<>
					<div className="text-left font-bold">{format(date, "d")}</div>
					{formattedSchedules && (
						<div className="text-xs mt-1 line-clamp-3 overflow-hidden w-full">
							<span className="font-black">{formattedSchedules?.event?.name}</span>: <br />
							{format(shiftStart, "h:mm a")} - {format(shiftEnd, "h:mm a")}
						</div>
					)}
					{hoveredEvent === formattedSchedules && formattedSchedules && (
						<div
							className={`${colorClass} ${textColorClass} absolute left-0 top-full mt-1 bg-foreground text-background shadow-lg p-2 text-xs w-40 z-10 rounded`}
						>
							<strong>{formattedSchedules?.event?.name}</strong>
							<br />
							{format(shiftStart, "h:mm a")} - {format(shiftEnd, "h:mm a")}
							<br />({formattedSchedules?.event?.description})
						</div>
					)}
				</>
			)}
		</div>
	);
}

export default function CalendarCell({ color, formattedSchedules, date, hoveredEvent, setHoveredEvent, openModal }) {
	const { loading } = useLoadContext();

	const colorClasses = {
		yellow: "bg-yellow-100 text-yellow-900",
		red: "bg-red-100 text-red-900",
		green: "bg-green-100 text-green-900",
		blue: "bg-blue-100 text-blue-900",
		default: "border-gray-200",
	};

	const colorClass = colorClasses[color] || colorClasses.default;
	const textColorClass = colorClasses[color]?.split(" ")[1] || "";

	return (
		<CellContent
			colorClass={colorClass}
			textColorClass={textColorClass}
			formattedSchedules={formattedSchedules}
			date={date}
			hoveredEvent={hoveredEvent}
			setHoveredEvent={setHoveredEvent}
			loading={loading}
		/>
	);
}
