import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx"; // npm install clsx

export default function Draggable({ id, title, project, color, className }) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		borderLeft: `4px solid ${color || "transparent"}`, // show status color
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className={clsx(
				"group relative p-3 my-2 rounded shadow cursor-grab bg-accent text-foreground",
				className // 🔥 merged external styles
			)}
		>
			<span className="block w-full font-medium">{title}</span>
			{project && <span className="block text-xs text-gray-500">{project}</span>}
		</div>
	);
}
