import { Link, useNavigate, useParams } from "react-router-dom";
// import { columns } from "./columns";
// import { DataTable } from "./data-table";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import axiosClient from "@/axios.client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/contexts/ToastContextProvider";
import { columnsTask } from "@/pages/Tasks/List/columns";
import { DataTableTasks } from "@/pages/Tasks/List/data-table";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import UserForm from "../form";
import { PieChartDonut } from "@/components/chart/pie-chart-donut";
import GalaxyProfileBanner from "@/components/design/galaxy";
import { AreaChartGradient } from "@/components/chart/area-chart-gradient";
import { RadarChartGridFilled } from "@/components/chart/radar-chart-grid-filled";
export default function UserProfile() {
	const { id } = useParams(); // Get user ID from URL
	const [user, setUser] = useState(null); // State for user details
	const { loading, setLoading } = useLoadContext();
	const [tasks, setTasks] = useState([]);
	const showToast = useToast();
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenUser, setIsOpenUser] = useState(false);
	const [updateData, setUpdateData] = useState({});
	const [updateDataUser, setUpdateDataUser] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		if (!isOpen) setUpdateData({});
		if (!isOpenUser) setUpdateDataUser({});
	}, [isOpen, isOpenUser]);

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

	const handleUpdateUser = (user) => {
		setIsOpenUser(true);
		setUpdateDataUser(user);
	};
	const handleDelete = async (id) => {
		setLoading(true);
		try {
			await axiosClient.delete(`/user-auth/${id}`);
			showToast("Success!", "User deleted.", 3000);
			navigate("/users");
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
			<GalaxyProfileBanner user={user} handleUpdateUser={handleUpdateUser} handleDelete={handleDelete} />
			{/* Update user Form Sheet */}
			<Sheet open={isOpenUser} onOpenChange={setIsOpenUser} modal={false}>
				<SheetContent side="right" className="overflow-y-auto w-[400px] sm:w-[540px]">
					<SheetHeader>
						<SheetTitle>Update User</SheetTitle>
					</SheetHeader>
					<UserForm setIsOpen={setIsOpenUser} updateData={updateDataUser} setUpdateData={setUpdateDataUser} fetchData={fetchData} />
				</SheetContent>
			</Sheet>
			<div className="flex flex-col gap-4 w-full">
				{/* ---------------------------- Task and Insight ---------------------------- */}
				<div className="flex flex-col lg:flex-row justify-between gap-4 w-full h-fit">
					<div className="w-full h-full overflow-auto bg-card text-card-foreground border border-border rounded-md container p-4 md:p-10 shadow-md">
						{/* <div className="mb-5">
							<h1 className=" font-extrabold text-xl">Tasks by Status</h1>
							<p>Pie Chart of Tasks by Status</p>
						</div> */}
						<PieChartDonut user_id={user?.id} />
					</div>
					<div className="w-full h-full overflow-auto bg-card text-card-foreground border border-border rounded-md container p-4 md:p-10 shadow-md">
						{/* <div className="mb-5">
							<h1 className=" font-extrabold text-xl">Activity Timeline</h1>
							<p>Daily Task Activity Timeline</p>
						</div> */}
						<AreaChartGradient />
					</div>
					<div className="w-full h-full overflow-auto bg-card text-card-foreground border border-border rounded-md container p-4 md:p-10 shadow-md">
						{/* <div className="mb-5">
							<h1 className=" font-extrabold text-xl">Tasks by Status</h1>
							<p>Pie Chart of Tasks by Status</p>
						</div> */}
						<RadarChartGridFilled />
					</div>
				</div>
				{/* ---------------------------- Task and Insight ---------------------------- */}
				<div className="flex min-h-[500px] md:max-h-[550px] flex-col lg:flex-row justify-between gap-4 w-full">
					<div className="w-full overflow-auto scrollbar-custom bg-card text-card-foreground border border-border rounded-md container p-4 md:p-10 shadow-md">
						<div>
							<h1 className=" font-extrabold text-3xl">Tasks</h1>
							<p>View list of all tasks</p>
						</div>

						<DataTableTasks
							columns={columnsTask({ handleDelete, setIsOpen, setUpdateData }, false)}
							data={tasks}
							setTasks={setTasks}
							updateData={updateData}
							setUpdateData={setUpdateData}
							isOpen={isOpen}
							setIsOpen={setIsOpen}
							fetchData={fetchData}
							showLess={true}
						/>
					</div>
					<div className="w-full h-full overflow-auto bg-card text-card-foreground border border-border rounded-md container p-4 md:p-10 shadow-md">
						<div className="mb-5">
							<h1 className=" font-extrabold text-3xl">Tasks by Status</h1>
							<p>Pie Chart of Tasks by Status</p>
						</div>
						<PieChartDonut />
					</div>
				</div>
			</div>
		</div>
	);
}
