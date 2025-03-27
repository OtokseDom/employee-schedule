import { Link } from "react-router-dom";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserProfile() {
	return (
		<>
			<div className={"flex flex-col justify-center w-full"}>
				<Link to="/schedule">
					<Button variant="ghost" className="flex items-center">
						<ArrowLeft />
					</Button>
				</Link>
				{/* Main Content */}
				{/* Employee Management Card */}
				<div className="flex flex-row justify-between items-center gap-4 w-fit p-4 bg-background rounded-lg shadow-md my-4">
					<div>
						<div className="w-24 h-24 bg-foreground rounded-full"></div>
					</div>
					<div>
						<div className="flex flex-row justify-between gap-4 items-center">
							<h2 className="text-lg font-semibold">John Dominic Escoto</h2>
							<Button variant="ghost" className="flex items-center">
								<Edit size={20} />
							</Button>
						</div>
						<div className="text-gray-500">
							<p>imjohndominic08@gmail.com</p>
							<p>+971 52 000 0000</p>
							<p>Discovery Gardens, Dubai, UAE</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
