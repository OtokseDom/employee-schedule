import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Check, Clock, Edit, GripVertical, Text } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";

const Items = ({ item }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: item.id,
		data: {
			type: "item",
		},
	});
	// Local today/tomorrow
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const tomorrow = new Date(today);
	tomorrow.setDate(today.getDate() + 1);

	// Convert task dates to local
	const startDate = item.start_date ? new Date(item.start_date) : null;
	const endDate = item.end_date ? new Date(item.end_date) : null;

	// Helper functions
	const isBeforeToday = (date) => date < today;
	const isTodayOrTomorrow = (date) => date >= today && date <= tomorrow;

	return (
		<div
			ref={setNodeRef}
			{...attributes}
			style={{
				transition,
				transform: CSS.Translate.toString(transform),
			}}
			className={clsx(
				"p-2 bg-sidebar-accent shadow-md rounded-md w-full border border-transparent hover:border-foreground cursor-pointer group",
				isDragging && "opacity-50"
			)}
		>
			<div className="flex flex-row w-full items-center justify-between draggable touch-none">
				{/* Grip handle */}
				<div className="w-full py-1 hover:cursor-grab active:cursor-grabbing" {...listeners}>
					<GripVertical size={16} />
				</div>

				{/* Edit button */}
				<Button
					variant="ghost"
					onClick={() => console.log("Edit", item.id)}
					className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
					// prevent this button from being draggable
					onMouseDown={(e) => e.stopPropagation()}
					onTouchStart={(e) => e.stopPropagation()}
				>
					<Edit size={16} />
				</Button>
			</div>
			<div className="flex justify-start">
				<Toggle variant="default" size="none" aria-label="Toggle" className="group h-fit py-2">
					<div className="w-0 group-hover:w-7 group-data-[state=on]:w-7 transition-all duration-500 ease-in-out">
						<Check className="aspect-square rounded-full border border-foreground opacity-0 group-hover:opacity-100 group-data-[state=on]:opacity-100 group-data-[state=on]:bg-green-500 transition-all duration-500 ease-in-out" />
					</div>
				</Toggle>
				<div className="w-full">
					<p>{item.title}</p>
					<span className="flex flex-row items-center gap-x-1 text-sm text-muted-foreground">
						<span
							className={`flex items-center gap-x-1 p-1 rounded ${
								endDate && isBeforeToday(endDate)
									? "bg-red-300 text-black" // overdue
									: endDate && isTodayOrTomorrow(endDate)
									? "bg-yellow-700 text-black" // near due
									: ""
							}`}
						>
							{endDate && <Clock size={16} />}
							{startDate && `${startDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })} - `}
							{endDate &&
								endDate.toLocaleDateString(undefined, {
									month: "short",
									day: "numeric",
								})}
						</span>
						{item.description && <Text size={14} className="text-muted-foreground" />}
					</span>
				</div>
			</div>
		</div>
	);
};

export default Items;
