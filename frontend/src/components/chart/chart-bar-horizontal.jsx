"use client";

import { ArrowBigDownDash, ArrowBigUpDash, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { Skeleton } from "../ui/skeleton";
import { useMemo } from "react";

export const description = "A horizontal bar chart";

const chartData = [
	{ user: "January", task: 186 },
	{ user: "February", task: 305 },
	{ user: "March", task: 237 },
	{ user: "April", task: 73 },
	{ user: "May", task: 209 },
	{ user: "June", task: 214 },
];

export function ChartBarHorizontal({ report, variant }) {
	const { loading, setLoading } = useLoadContext();

	const totalTasks = useMemo(() => {
		return report?.chart_data?.reduce((acc, curr) => acc + curr.tasks, 0);
	}, [report]);
	const chartConfig = {
		task: {
			label: "Task",
			color: "hsl(var(--chart-1))",
			// color: "hsl(270 70% 50%)", // Purple
		},
	};
	return (
		<Card className={`flex flex-col relative w-full h-full justify-between rounded-2xl`}>
			<CardHeader className="text-center">
				<CardTitle>User Task Load</CardTitle>
				<CardDescription>
					{report?.filters?.from && report?.filters?.to
						? `${new Date(report.filters.from).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })} - ${new Date(
								report.filters.to
						  ).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}`
						: "All Time"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					{loading ? (
						<div className="flex flex-col gap-2 items-center justify-center h-full w-full p-8">
							<Skeleton className=" w-full h-10 rounded-full" />
							<Skeleton className=" w-full h-10 rounded-full" />
							<Skeleton className=" w-full h-10 rounded-full" />
							<Skeleton className=" w-full h-10 rounded-full" />
						</div>
					) : totalTasks == 0 ? (
						<div className="flex items-center justify-center fw-full h-full text-3xl text-gray-500">No Tasks Yet</div>
					) : (
						<BarChart
							accessibilityLayer
							data={report?.chart_data}
							layout="vertical"
							margin={{
								right: 16,
							}}
						>
							<CartesianGrid horizontal={false} />
							<YAxis
								dataKey="user"
								type="category"
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								tickFormatter={(value) => value.slice(0, 3)}
								hide
							/>
							<XAxis dataKey="task" type="number" hide />
							<ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
							<Bar dataKey="task" layout="vertical" fill="var(--color-task)" radius={4}>
								<LabelList dataKey="user" position="insideLeft" offset={8} className="fill-(--color-label)" fontSize={12} />
								<LabelList dataKey="task" position="right" offset={8} className="fill-foreground" fontSize={12} />
							</Bar>
						</BarChart>
					)}
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				{loading ? (
					<div className="flex flex-col gap-2 items-center justify-center h-full w-full">
						<Skeleton className=" w-full h-4 rounded-full" />
						<Skeleton className=" w-full h-4 rounded-full" />
					</div>
				) : totalTasks == 0 ? (
					""
				) : (
					<>
						<div className="leading-none font-medium">
							<ArrowBigUpDash size={16} className="inline text-green-500" /> <b> {report?.highest?.user}</b> has the highest task load of{" "}
							<b> {report?.highest?.task}</b> tasks
						</div>
						<div className="leading-none font-medium">
							<ArrowBigDownDash size={16} className="inline text-red-500" /> <b>{report?.lowest?.user}</b> has the lowest task load of{" "}
							<b> {report?.lowest?.task}</b> tasks
						</div>
						<div className="text-muted-foreground leading-none">Showing all {report?.count} users</div>
					</>
				)}
			</CardFooter>
		</Card>
	);
}
