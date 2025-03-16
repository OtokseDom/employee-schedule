import { TrafficCone } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function Task() {
	return (
		<>
			<div className={"flex flex-col items-center justify-center h-full"}>
				<h2 className="text-3xl font-semibold mb-4">Employee Task Tracker with Report Under Construction</h2>
				<TrafficCone size={160} className="text-orange-900" />
			</div>
		</>
	);
}
