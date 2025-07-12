import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import axiosClient from "@/axios.client";
import { useToast } from "@/contexts/ToastContextProvider";
import { columnsTask } from "@/pages/Tasks/List/columns";
import { DataTableTasks } from "@/pages/Tasks/List/data-table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import UserForm from "../form";
import { PieChartDonut } from "@/components/chart/pie-chart-donut";
import GalaxyProfileBanner from "@/components/design/galaxy";
import { AreaChartGradient } from "@/components/chart/area-chart-gradient";
import { RadarChartGridFilled } from "@/components/chart/radar-chart-grid-filled";
import { ChartLineLabel } from "@/components/chart/line-chart-label";
import { ChartBarMultiple } from "@/components/chart/bar-chart-multiple";
export default function UserProfile() {
	const { id } = useParams(); // Get user ID from URL
	const [user, setUser] = useState(null); // State for user details
	const { setLoading } = useLoadContext();
	const [tasks, setTasks] = useState([]);
	const [userReports, setUserReports] = useState(null); // State for all user reports
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
		document.title = "Task Management | User Profile";
		fetchData();
	}, []);

	const fetchData = async () => {
		setLoading(true);
		try {
			// Fetch user details and tasks
			const response = await axiosClient.get(`/user/${id}`);
			setUser(response.data.data.user);
			setTasks(response.data.data.assigned_tasks);
			// Fetch all user reports in one call
			const reportsRes = await axiosClient.get(`/user/${id}/reports`);
			setUserReports(reportsRes.data.data);
			setLoading(false);
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
			await axiosClient.delete(`/user/${id}`);
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
				<div className="flex flex-col lg:flex-row justify-between gap-4 w-full items-stretch">
					<div className="w-full overflow-auto bg-card text-card-foreground border border-border rounded-2xl container p-4 md:p-10 shadow-md">
						{/* <div className="mb-5">
							<h1 className=" font-extrabold text-xl">Tasks by Status</h1>
							<p>Pie Chart of Tasks by Status</p>
						</div> */}
						<PieChartDonut report={userReports?.tasks_by_status} />
					</div>
					<div className="w-full overflow-auto bg-card text-card-foreground border border-border rounded-2xl container p-4 md:p-10 shadow-md">
						{/* <div className="mb-5">
							<h1 className=" font-extrabold text-xl">Activity Timeline</h1>
							<p>Daily Task Activity Timeline</p>
						</div> */}
						<AreaChartGradient report={userReports?.task_activity_timeline} />
					</div>
					<div className="w-full overflow-auto bg-card text-card-foreground border border-border rounded-2xl container p-4 md:p-10 shadow-md">
						{/* <div className="mb-5">
							<h1 className=" font-extrabold text-xl">Tasks by Status</h1>
							<p>Pie Chart of Tasks by Status</p>
						</div> */}
						<RadarChartGridFilled report={userReports?.rating_per_category} />
					</div>
				</div>
				{/* ---------------------------- Performance Trend & Estimate vs Actual time ---------------------------- */}
				<div className="flex flex-col lg:flex-row gap-4 w-full items-stretch">
					<div className="w-full overflow-auto bg-card text-card-foreground border border-border rounded-2xl container p-4 md:p-10 shadow-md">
						{/* <div className="mb-5">
							<h1 className=" font-extrabold text-xl">Tasks by Status</h1>
							<p>Pie Chart of Tasks by Status</p>
						</div> */}
						<ChartLineLabel report={userReports?.performance_rating_trend} />
					</div>
					<div className="w-full overflow-auto bg-card text-card-foreground border border-border rounded-2xl container p-4 md:p-10 shadow-md">
						{/* <div className="mb-5">
							<h1 className=" font-extrabold text-xl">Tasks by Status</h1>
							<p>Pie Chart of Tasks by Status</p>
						</div> */}
						<ChartBarMultiple report={userReports?.estimate_vs_actual} />
					</div>
				</div>
				{/* ---------------------------- Task and Insight ---------------------------- */}
				<div className="flex min-h-[500px] max-h-[700px] flex-col lg:flex-row justify-between gap-4 w-full">
					<div className="w-full overflow-auto scrollbar-custom bg-card text-card-foreground border border-border rounded-2xl container p-4 md:p-10 shadow-md">
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
				</div>
			</div>
		</div>
	);
}
