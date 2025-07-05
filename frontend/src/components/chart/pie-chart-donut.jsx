"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { useMemo } from "react";
import { Skeleton } from "../ui/skeleton";

export function PieChartDonut({ report, variant }) {
	const { loading, setLoading } = useLoadContext();

	const chartConfig = {
		tasks: {
			label: "Tasks",
		},
		pending: {
			label: "Pending",
			color: "hsl(270 70% 50%)", // Purple
			// color: "hsl(30 80% 55%)", // Yellow
		},
		in_progress: {
			label: "In Progress",
			color: "hsl(var(--chart-1))",
			// color: "hsl(220 70% 50%)", // Blue
		},
		completed: {
			label: "Completed",
			color: "hsl(var(--chart-3))",
			// color: "hsl(160 60% 45%)", // Green
		},
		delayed: {
			label: "Delayed",
			color: "hsl(var(--chart-5))",
			// color: "hsl(340 75% 65%)", // Pink
		},
		cancelled: {
			label: "Cancelled",
			color: "hsl(var(--chart-7))",
			// color: "hsl(340 75% 55%)", // Dark Pink
		},
		on_hold: {
			label: "On Hold",
			color: "hsl(var(--chart-9))",
			// color: "hsl(340 75% 45%)", // Darkest Pink
		},
	};
	const totalTasks = useMemo(() => {
		return report?.reduce((acc, curr) => acc + curr.tasks, 0);
	}, [report]);

	return (
		<Card className={`flex flex-col relative h-full justify-between ${variant == "solid" ? "bg-primary-foreground rounded-2xl" : ""}`}>
			<CardHeader className="items-center text-center pb-0">
				<CardTitle>Tasks by Status</CardTitle>
				<CardDescription>All Time</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
					{loading ? (
						<div className="flex items-center justify-center h-full w-full p-8">
							<Skeleton className=" w-full h-full rounded-full" />
						</div>
					) : (
						<PieChart>
							<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
							<Pie data={report} dataKey="tasks" nameKey="status" innerRadius={60} strokeWidth={5}>
								<Label
									content={({ viewBox }) => {
										if (viewBox && "cx" in viewBox && "cy" in viewBox) {
											return (
												<text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
													<tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
														{totalTasks?.toLocaleString()}
													</tspan>
													<tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
														Tasks
													</tspan>
												</text>
											);
										}
									}}
								/>
							</Pie>
						</PieChart>
					)}
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex flex-wrap gap-2 text-sm">
				{loading ? (
					<div className="flex flex-col gap-2 items-center justify-center h-full w-full p-8">
						<Skeleton className=" w-full h-4" />
						<Skeleton className=" w-full h-4" />
					</div>
				) : (
					<div className="flex flex-wrap justify-center items-center gap-4 leading-none text-muted-foreground">
						{report?.map((data, index) => (
							<div key={index} className="flex items-center gap-1">
								<span className="font-bold">{data.tasks}</span> {chartConfig[data.status]?.label || data.status}
							</div>
						))}
					</div>
				)}
			</CardFooter>
		</Card>
	);
}
