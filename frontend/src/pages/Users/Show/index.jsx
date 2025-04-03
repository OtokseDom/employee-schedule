import { Link, useParams } from "react-router-dom";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import axiosClient from "@/axios.client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/contexts/ToastContextProvider";

export default function UserProfile() {
	const { id } = useParams(); // Get user ID from URL
	// const { loading, setLoading } = useLoadContext();
	const [user, setUser] = useState(null); // State for user details
	// const [tasks, setTasks] = useState([]);

	// useEffect(() => {
	// 	fetchData();
	// }, []);

	const { loading, setLoading } = useLoadContext();
	const [tasks, setTasks] = useState([]);
	const showToast = useToast();
	const [isOpen, setIsOpen] = useState(false);
	const [deleted, setDeleted] = useState(false);
	const [updateData, setUpdateData] = useState({});

	useEffect(() => {
		if (!isOpen) setUpdateData({});
	}, [isOpen]);
	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		setLoading(true);
		try {
			// Fetch user details and tasks
			const response = await axiosClient.get(`/user-auth/${id}`);
			setUser(response.data.user);
			setTasks(response.data.assigned_tasks);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			setLoading(false);
		}
	};
	// const fetchData = async () => {
	// 	setLoading(true);
	// 	try {
	// 		// Make both API calls concurrently using Promise.all
	// 		const taskResponse = await axiosClient.get("/task");
	// 		setTasks(taskResponse.data.data);
	// 	} catch (e) {
	// 		console.error("Error fetching data:", e);
	// 	} finally {
	// 		// Always stop loading when done
	// 		setLoading(false);
	// 	}
	// };

	const handleDelete = async (id) => {
		setLoading(true);
		try {
			await axiosClient.delete(`/task/${id}`);
			fetchData();
			showToast("Success!", "Task deleted.", 3000);
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 3000, "fail");
			console.error("Error fetching data:", e);
		} finally {
			// Always stop loading when done
			setLoading(false);
		}
	};

	return (
		<div className={"flex flex-col w-screen md:w-full container p-5 md:p-0 sm:text-sm -mt-10"}>
			{/* ------------------------------- Back button ------------------------------ */}
			<Link to="/users">
				<Button variant="ghost" className="flex items-center">
					<ArrowLeft />
				</Button>
			</Link>
			{/* ------------------------------ User Details ------------------------------ */}
			<div className="flex flex-row justify-between items-center gap-4 w-full md:w-fit p-4 bg-background rounded-lg border border-border shadow-md my-4">
				<div>{loading ? <Skeleton className="w-24 h-24 rounded-full" /> : <div className="w-24 h-24 bg-foreground rounded-full"></div>}</div>
				<div>
					{loading ? (
						<Skeleton className="h-10 w-60" />
					) : (
						<div className="flex flex-row justify-between gap-4 items-center">
							<h2 className="text-sm md:text-lg font-semibold"> {user?.name || "N/A"}</h2>
							<Button variant="ghost" className="flex items-center">
								<Edit size={20} />
							</Button>
						</div>
					)}
					{loading ? (
						Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-4 w-full mt-1" />)
					) : (
						<div className="text-gray-500">
							<p>{user?.email || "N/A"}</p>
							<p className="font-bold">{user?.position || "N/A"}</p>
							<p>{user?.role || "N/A"}</p>
						</div>
					)}
				</div>
			</div>
			{/* ---------------------------- Task and Insight ---------------------------- */}
			<div className="flex flex-col lg:flex-row justify-between gap-4 w-full">
				<div className="w-full min-h-[500px] max-h-[500px] overflow-auto scrollbar-custom bg-card text-card-foreground border border-border rounded-md container p-4 md:p-10 shadow-md">
					<div>
						<h1 className=" font-extrabold text-3xl">Tasks</h1>
						<p>View list of all tasks</p>
					</div>
					<DataTable
						columns={columns({ handleDelete, setIsOpen, setUpdateData })}
						data={tasks}
						setTasks={setTasks}
						updateData={updateData}
						setUpdateData={setUpdateData}
						isOpen={isOpen}
						setIsOpen={setIsOpen}
						fetchData={fetchData}
					/>
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
	);
}
