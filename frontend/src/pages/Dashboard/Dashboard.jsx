import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function Dashboard() {
	return (
		<>
			<div className={"flex justify-between gap-5"}>
				{/* Main Content */}
				{/* Employee Management Card */}
				<div className="border border-foreground bg-background text-foreground p-6 rounded-lg shadow-md hover:scale-105 transition duration-300">
					<h2 className="text-lg font-semibold mb-4">Employee Management</h2>
					<p className="text-foreground">Manage employees, their details, and roles in your organization.</p>
				</div>

				{/* Event Management Card */}
				<div className="border border-foreground bg-background text-foreground p-6 rounded-lg shadow-md hover:scale-105 transition duration-300">
					<h2 className="text-lg font-semibold mb-4">Event Management</h2>
					<p className="text-foreground">Create, edit, and schedule company events and activities.</p>
				</div>

				{/* Schedule Management Card */}
				<div className="border border-foreground bg-background text-foreground p-6 rounded-lg shadow-md hover:scale-105 transition duration-300">
					<h2 className="text-lg font-semibold mb-4">Schedule Management</h2>
					<p className="text-foreground">Organize and manage work schedules for employees.</p>
				</div>
			</div>
		</>
	);
}
