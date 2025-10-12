"use client";

import { ArrowBigDownDash, ArrowBigUpDash, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { Skeleton } from "../ui/skeleton";

export const description = "A bar chart with a label";

// const chartData = [
// 	{ month: "January", desktop: 186 },
// 	{ month: "February", desktop: 305 },
// 	{ month: "March", desktop: 237 },
// 	{ month: "April", desktop: 73 },
// 	{ month: "May", desktop: 209 },
// 	{ month: "June", desktop: 214 },
// ];

// const chartConfig = {
// 	desktop: {
// 		label: "Desktop",
// 		color: "var(--chart-1)",
// 	},
// };

export function ChartBarLabel({ report, variant }) {
	const { loading } = useLoadContext();

	const chartConfig = {
		delay: {
			label: "Delay",
			color: "hsl(var(--chart-1))",
			// color: "hsl(270 70% 50%)", // Purple
		},
	};
	return (
		<Card className={`flex flex-col relative h-full justify-between rounded-2xl`}>
			<CardHeader className="text-center">
				<CardTitle className="text-lg">Delays per User</CardTitle>
				<CardDescription>
					Encountered delays{" "}
					{report?.filters?.from && report?.filters?.to
						? `${new Date(report.filters.from).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })} - ${new Date(
								report.filters.to
						  ).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}`
						: "all time"}
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
					) : report?.data_count == 0 ? (
						<div className="flex items-center justify-center fw-full h-full text-3xl text-gray-500">No Tasks Yet</div>
					) : (
						<BarChart
							accessibilityLayer
							data={report?.chart_data}
							margin={{
								top: 20,
							}}
						>
							<CartesianGrid vertical={false} />
							<XAxis dataKey="assignee" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 5)} />
							<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
							<Bar dataKey="delay" fill="var(--color-delay)" radius={8}>
								<LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
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
				) : report?.data_count == 0 ? (
					""
				) : (
					<>
						<div className="leading-none font-medium">
							<ArrowBigUpDash size={16} className="inline text-green-500" /> <b> {report?.highest_delay?.assignee}</b> has the most delays
							encountered (<b>{report?.highest_delay?.delay}</b> days)
						</div>
						<div className="leading-none font-medium">
							<ArrowBigDownDash size={16} className="inline text-red-500" /> <b>{report?.lowest_delay?.assignee}</b> has the least delays
							encountered (<b>{report?.lowest_delay?.delay}</b> days)
						</div>
						<div className="text-muted-foreground leading-none">Showing all {report?.data_count} users</div>
					</>
				)}
			</CardFooter>
		</Card>
	);
}
