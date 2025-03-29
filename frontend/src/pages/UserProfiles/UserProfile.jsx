import { Link } from "react-router-dom";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import axiosClient from "@/axios.client";

export default function UserProfile() {
	const { loading, setLoading } = useLoadContext();
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		fetchData();
	}, []);
	const fetchData = async () => {
		setLoading(true);
		try {
			// Make both API calls concurrently using Promise.all
			const taskResponse = await axiosClient.get("/task");
			setTasks(taskResponse.data.data);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
	};

	return (
		<>
			{/* TODO: Mobile responsive */}
			<div className={"flex flex-col justify-center w-full"}>
				{/* ------------------------------- Back button ------------------------------ */}
				<Link to="/schedule">
					<Button variant="ghost" className="flex items-center">
						<ArrowLeft />
					</Button>
				</Link>
				{/* ------------------------------- Back button ------------------------------ */}
				<div className="flex flex-row justify-between items-center gap-4 w-fit p-4 bg-background rounded-lg border border-border shadow-md my-4">
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
				{/* ---------------------------- Task and Insight ---------------------------- */}
				<div className="flex flex-row justify-between gap-4 w-full">
					<div className="w-full h-3/4 overflow-auto scrollbar-custom bg-card text-card-foreground border border-border rounded-md container p-4 md:p-10 shadow-md">
						<div>
							<h1 className=" font-extrabold text-3xl">Tasks</h1>
							<p>View list of all tasks</p>
						</div>
						<DataTable columns={columns} data={tasks} />
					</div>
					<div className="w-full h-3/4 overflow-auto bg-card text-card-foreground border border-border rounded-md container p-4 md:p-10 shadow-md">
						<div>
							<h1 className=" font-extrabold text-3xl">Insights</h1>
							<p>View list of all tasks</p>
						</div>
						<div className="w-full h-52 bg-secondary mt-5 p-5 rounded-sm">Hello</div>
					</div>
				</div>
			</div>
		</>
	);
}
