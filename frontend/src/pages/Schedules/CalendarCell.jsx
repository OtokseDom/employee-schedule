import React from "react";
import { Skeleton } from "../../components/ui/skeleton";
import { format, parse } from "date-fns";
import { useLoadContext } from "@/contexts/LoadContextProvider";

export default function CalendarCell({ color, formattedSchedules, date, hoveredEvent, setHoveredEvent, openModal }) {
	const { loading } = useLoadContext();
	const shiftStart = formattedSchedules?.shift_start ? parse(formattedSchedules.shift_start, "HH:mm:ss", new Date()) : null;
	const shiftEnd = formattedSchedules?.shift_end ? parse(formattedSchedules.shift_end, "HH:mm:ss", new Date()) : null;
	return color == "yellow" ? (
		<div
			className={`bg-yellow-100 text-yellow-900
							border border-gray-200 p-2 h-20 sm:h-24 cursor-pointer hover:bg-secondary rounded-lg relative `}
			// onClick={() => openModal(format(date, "yyyy-MM-dd"))}
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
							<span className=" font-black">{formattedSchedules?.event?.name}</span>:<br />
							<span className="hidden md:block">
								{format(shiftStart, "h:mm a")} - {format(shiftEnd, "h:mm a")}
							</span>
						</div>
					)}
					{hoveredEvent === formattedSchedules && formattedSchedules && (
						<div
							className={`bg-yellow-100 text-yellow-900 absolute left-0 top-full mt-1 bg-foreground text-background shadow-lg p-2 text-xs w-40 z-10 rounded`}
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
	) : color == "red" ? (
		<div
			className={`bg-red-100 text-red-900
							border border-gray-200 p-2 h-20 sm:h-24 cursor-pointer hover:bg-secondary rounded-lg relative `}
			// onClick={() => openModal(format(date, "yyyy-MM-dd"))}
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
							<span className=" font-black">{formattedSchedules?.event?.name}</span>: <br />
							{format(shiftStart, "h:mm a")} - {format(shiftEnd, "h:mm a")}
						</div>
					)}
					{hoveredEvent === formattedSchedules && formattedSchedules && (
						<div
							className={`bg-red-100 text-red-900 absolute left-0 top-full mt-1 bg-foreground text-background shadow-lg p-2 text-xs w-40 z-10 rounded`}
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
	) : color == "green" ? (
		<div
			className={`bg-green-100 text-green-900
							border border-gray-200 p-2 h-20 sm:h-24 cursor-pointer hover:bg-secondary rounded-lg relative `}
			// onClick={() => openModal(format(date, "yyyy-MM-dd"))}
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
							<span className=" font-black">{formattedSchedules?.event?.name}</span>: <br />
							{format(shiftStart, "h:mm a")} - {format(shiftEnd, "h:mm a")}
						</div>
					)}
					{hoveredEvent === formattedSchedules && formattedSchedules && (
						<div
							className={`bg-green-100 text-green-900 absolute left-0 top-full mt-1 bg-foreground text-background shadow-lg p-2 text-xs w-40 z-10 rounded`}
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
	) : color == "blue" ? (
		<div
			className={`bg-blue-100 text-blue-900
							border border-gray-200 p-2 h-20 sm:h-24 cursor-pointer hover:bg-secondary rounded-lg relative `}
			// onClick={() => openModal(format(date, "yyyy-MM-dd"))}
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
							<span className=" font-black">{formattedSchedules?.event?.name}</span>: <br />
							{format(shiftStart, "h:mm a")} - {format(shiftEnd, "h:mm a")}
						</div>
					)}
					{hoveredEvent === formattedSchedules && formattedSchedules && (
						<div
							className={`bg-blue-100 text-blue-900 absolute left-0 top-full mt-1 bg-foreground text-background shadow-lg p-2 text-xs w-40 z-10 rounded`}
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
	) : (
		<div
			className={`border border-gray-200 p-2 h-20 sm:h-24 cursor-pointer hover:bg-secondary rounded-lg relative `}
			// onClick={() => openModal(format(date, "yyyy-MM-dd"))}
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
							<span className=" font-black">{formattedSchedules?.event?.name}</span>: <br />
							{format(shiftStart, "h:mm a")} - {format(shiftEnd, "h:mm a")}
						</div>
					)}
					{hoveredEvent === formattedSchedules && formattedSchedules && (
						<div className={` absolute left-0 top-full mt-1 bg-foreground text-background shadow-lg p-2 text-xs w-40 z-10 rounded`}>
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
