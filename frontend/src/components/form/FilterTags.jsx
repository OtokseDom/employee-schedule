import { X } from "lucide-react";

export default function FilterTags({ filters, onRemove }) {
	return (
		<div className="flex flex-wrap gap-2">
			{Object.entries(filters).map(
				([key, value]) =>
					value && (
						<div key={key} className="flex items-center gap-1 bg-secondary text-foreground text-sm px-3 py-1 rounded-md">
							<span className="">
								{key}: {value}
							</span>
							<button onClick={() => onRemove(key)} className="hover:text-red-500">
								<X size={14} />
							</button>
						</div>
					)
			)}
		</div>
	);
}
