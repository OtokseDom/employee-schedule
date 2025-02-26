import React from "react";
import { Skeleton } from "../ui/skeleton";
import { format } from "date-fns";

export default function CalendarCell({ color, loading, formattedSchedules, date, hoveredEvent, setHoveredEvent, openModal }) {
	return color == "yellow" ? (
		<div
			className={`bg-yellow-100 text-yellow-900
							border border-gray-200 p-2 h-20 sm:h-24 cursor-pointer hover:bg-secondary rounded-lg relative `}
			onClick={() => openModal(format(date, "yyyy-MM-dd"))}
			onMouseEnter={() => setHoveredEvent(formattedSchedules)}
			onMouseLeave={() => setHoveredEvent(null)}
		>
			{loading ? (
				<div className="flex flex-col space-y-3 w-full">
					<div className="flex flex-row justify-between">
						<Skeleton className="h-4 w-1/5" />
						<Skeleton className="h-4 w-3/5" />
					</div>
					<Skeleton className="h-4 w-2/5 md:w-full" />
					<Skeleton className="h-4 w-2/5 md:w-full" />
				</div>
			) : (
				<>
					<div className="text-sm font-bold">{format(date, "d")}</div>
					{formattedSchedules && (
						<div className="text-xs mt-1 line-clamp-3 overflow-hidden w-full">
							<span className=" font-black">{formattedSchedules?.employee?.name}</span>: {formattedSchedules?.shift_start} -{" "}
							{formattedSchedules?.shift_end}
						</div>
					)}
					{hoveredEvent === formattedSchedules && formattedSchedules && (
						<div
							className={`bg-yellow-100 text-yellow-900 absolute left-0 top-full mt-1 bg-foreground text-background shadow-lg p-2 text-xs w-40 z-10 rounded`}
						>
							<strong>{formattedSchedules?.employee?.name}</strong>: {formattedSchedules?.event?.name}
							<br />
							{formattedSchedules?.shift_start} - {formattedSchedules?.shift_end}
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
			onClick={() => openModal(format(date, "yyyy-MM-dd"))}
			onMouseEnter={() => setHoveredEvent(formattedSchedules)}
			onMouseLeave={() => setHoveredEvent(null)}
		>
			{loading ? (
				<div className="flex flex-col space-y-3 w-full">
					<div className="flex flex-row justify-between">
						<Skeleton className="h-4 w-1/5" />
						<Skeleton className="h-4 w-3/5" />
					</div>
					<Skeleton className="h-4 w-2/5 md:w-full" />
					<Skeleton className="h-4 w-2/5 md:w-full" />
				</div>
			) : (
				<>
					<div className="text-sm font-bold">{format(date, "d")}</div>
					{formattedSchedules && (
						<div className="text-xs mt-1 line-clamp-3 overflow-hidden w-full">
							<span className=" font-black">{formattedSchedules?.employee?.name}</span>: {formattedSchedules?.shift_start} -{" "}
							{formattedSchedules?.shift_end}
						</div>
					)}
					{hoveredEvent === formattedSchedules && formattedSchedules && (
						<div
							className={`bg-red-100 text-red-900 absolute left-0 top-full mt-1 bg-foreground text-background shadow-lg p-2 text-xs w-40 z-10 rounded`}
						>
							<strong>{formattedSchedules?.employee?.name}</strong>: {formattedSchedules?.event?.name}
							<br />
							{formattedSchedules?.shift_start} - {formattedSchedules?.shift_end}
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
			onClick={() => openModal(format(date, "yyyy-MM-dd"))}
			onMouseEnter={() => setHoveredEvent(formattedSchedules)}
			onMouseLeave={() => setHoveredEvent(null)}
		>
			{loading ? (
				<div className="flex flex-col space-y-3 w-full">
					<div className="flex flex-row justify-between">
						<Skeleton className="h-4 w-1/5" />
						<Skeleton className="h-4 w-3/5" />
					</div>
					<Skeleton className="h-4 w-2/5 md:w-full" />
					<Skeleton className="h-4 w-2/5 md:w-full" />
				</div>
			) : (
				<>
					<div className="text-sm font-bold">{format(date, "d")}</div>
					{formattedSchedules && (
						<div className="text-xs mt-1 line-clamp-3 overflow-hidden w-full">
							<span className=" font-black">{formattedSchedules?.employee?.name}</span>: {formattedSchedules?.shift_start} -{" "}
							{formattedSchedules?.shift_end}
						</div>
					)}
					{hoveredEvent === formattedSchedules && formattedSchedules && (
						<div
							className={`bg-green-100 text-green-900 absolute left-0 top-full mt-1 bg-foreground text-background shadow-lg p-2 text-xs w-40 z-10 rounded`}
						>
							<strong>{formattedSchedules?.employee?.name}</strong>: {formattedSchedules?.event?.name}
							<br />
							{formattedSchedules?.shift_start} - {formattedSchedules?.shift_end}
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
			onClick={() => openModal(format(date, "yyyy-MM-dd"))}
			onMouseEnter={() => setHoveredEvent(formattedSchedules)}
			onMouseLeave={() => setHoveredEvent(null)}
		>
			{loading ? (
				<div className="flex flex-col space-y-3 w-full">
					<div className="flex flex-row justify-between">
						<Skeleton className="h-4 w-1/5" />
						<Skeleton className="h-4 w-3/5" />
					</div>
					<Skeleton className="h-4 w-2/5 md:w-full" />
					<Skeleton className="h-4 w-2/5 md:w-full" />
				</div>
			) : (
				<>
					<div className="text-sm font-bold">{format(date, "d")}</div>
					{formattedSchedules && (
						<div className="text-xs mt-1 line-clamp-3 overflow-hidden w-full">
							<span className=" font-black">{formattedSchedules?.employee?.name}</span>: {formattedSchedules?.shift_start} -{" "}
							{formattedSchedules?.shift_end}
						</div>
					)}
					{hoveredEvent === formattedSchedules && formattedSchedules && (
						<div
							className={`bg-blue-100 text-blue-900 absolute left-0 top-full mt-1 bg-foreground text-background shadow-lg p-2 text-xs w-40 z-10 rounded`}
						>
							<strong>{formattedSchedules?.employee?.name}</strong>: {formattedSchedules?.event?.name}
							<br />
							{formattedSchedules?.shift_start} - {formattedSchedules?.shift_end}
							<br />({formattedSchedules?.event?.description})
						</div>
					)}
				</>
			)}
		</div>
	) : (
		<div
			className={`border border-gray-200 p-2 h-20 sm:h-24 cursor-pointer hover:bg-secondary rounded-lg relative `}
			onClick={() => openModal(format(date, "yyyy-MM-dd"))}
			onMouseEnter={() => setHoveredEvent(formattedSchedules)}
			onMouseLeave={() => setHoveredEvent(null)}
		>
			{loading ? (
				<div className="flex flex-col space-y-3 w-full">
					<div className="flex flex-row justify-between">
						<Skeleton className="h-4 w-1/5" />
						<Skeleton className="h-4 w-3/5" />
					</div>
					<Skeleton className="h-4 w-2/5 md:w-full" />
					<Skeleton className="h-4 w-2/5 md:w-full" />
				</div>
			) : (
				<>
					<div className="text-sm font-bold">{format(date, "d")}</div>
					{formattedSchedules && (
						<div className="text-xs mt-1 line-clamp-3 overflow-hidden w-full">
							<span className=" font-black">{formattedSchedules?.employee?.name}</span>: {formattedSchedules?.shift_start} -{" "}
							{formattedSchedules?.shift_end}
						</div>
					)}
					{hoveredEvent === formattedSchedules && formattedSchedules && (
						<div className={` absolute left-0 top-full mt-1 bg-foreground text-background shadow-lg p-2 text-xs w-40 z-10 rounded`}>
							<strong>{formattedSchedules?.employee?.name}</strong>: {formattedSchedules?.event?.name}
							<br />
							{formattedSchedules?.shift_start} - {formattedSchedules?.shift_end}
							<br />({formattedSchedules?.event?.description})
						</div>
					)}
				</>
			)}
		</div>
	);
}
