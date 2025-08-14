import { statusColors } from "@/utils/taskHelpers";
import { Inspect } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

export default function Relations({ relations, setUpdateData, setActiveTab }) {
	return (
		<>
			{Array.isArray(relations.children) && relations.children.length > 0 ? (
				<div className="flex flex-col border rounded-xl text-sm gap-4">
					<div className="flex flex-col justify-between rounded-lg p-4 gap-4">
						<span
							className={`px-2 py-1 text-center whitespace-nowrap rounded-full h-fit w-fit text-xs ${
								statusColors[relations?.status] || "bg-gray-200 text-gray-800"
							}`}
						>
							{relations?.status.replace("_", " ")}
						</span>
						<div className="flex flex-row w-full justify-between items-start">
							<span className="text-lg">{relations.title}</span>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setUpdateData(relations);
									setActiveTab("update");
								}}
							>
								<Inspect />
							</Button>
						</div>
						<div>
							<span className="text-muted-foreground">2/4 subtasks completed</span>
							<Progress value={50} className="h-3" />
						</div>
					</div>
					<div className="flex flex-col bg-sidebar-accent">
						{relations?.children?.map((child) => (
							<div key={child.id} className="flex flex-row px-4 py-6 gap-2 hover:bg-secondary">
								<div className="flex flex-row w-full justify-between">
									<div className="flex flex-row h-fit items-center gap-2">
										<span
											className={`px-2 py-1 text-center whitespace-nowrap rounded-full h-fit w-fit text-xs ${
												statusColors[child?.status] || "bg-gray-200 text-gray-800"
											}`}
										>
											{child?.status.replace("_", " ")}
										</span>
										<span className="">{child?.title}</span>
									</div>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => {
											setUpdateData(child);
											setActiveTab("update");
										}}
									>
										<Inspect />
									</Button>
								</div>
							</div>
						))}
					</div>
				</div>
			) : (
				<div className="w-full text-muted-foreground text-lg text-center p-4">No Relations</div>
			)}
		</>
	);
}
