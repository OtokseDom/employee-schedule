import { statusColors } from "@/utils/taskHelpers";
import { Inspect } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

export default function Relations({ relations }) {
	return (
		<div className="flex flex-col border rounded-xl text-sm gap-4">
			<div className="flex flex-col justify-between rounded-lg p-4 gap-4">
				<span className="text-lg">{relations.title}</span>
				<div>
					<span className="text-muted-foreground">2/4 subtasks completed</span>
					<Progress value={50} />
				</div>
				{/* <span
					className={`px-2 py-1 text-center whitespace-nowrap rounded-full h-fit w-fit ${
						statusColors[relations?.status] || "bg-gray-200 text-gray-800"
					}`}
				>
					{relations.status.replace("_", " ")}
				</span> */}
			</div>
			<div className="flex flex-col bg-secondary p-4">
				{/* Children array */}
				<div className="flex flex-row py-4 gap-2">
					<div className="flex flex-row justify-between rounded-lg">
						<div className="flex flex-row h-fit items-center gap-2">
							<span
								className={`px-2 py-1 text-center whitespace-nowrap rounded-full h-fit w-fit text-xs ${
									statusColors[relations?.status] || "bg-gray-200 text-gray-800"
								}`}
							>
								{relations.status.replace("_", " ")}
							</span>
							<span className="">{relations.title}</span>
							<Button variant="ghost" size="sm">
								<Inspect />
							</Button>
						</div>
					</div>
				</div>
				<div className="flex flex-row py-4 gap-2">
					<div className="flex flex-row justify-between rounded-lg">
						<div className="flex flex-row h-fit items-center gap-2">
							<span
								className={`px-2 py-1 text-center whitespace-nowrap rounded-full h-fit w-fit text-xs ${
									statusColors[relations?.status] || "bg-gray-200 text-gray-800"
								}`}
							>
								{relations.status.replace("_", " ")}
							</span>
							<span className="">{relations.title}</span>
							<Button variant="ghost" size="sm">
								<Inspect />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
