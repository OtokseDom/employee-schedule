"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import axiosClient from "@/axios.client";
import { useMemo } from "react";
import { Skeleton } from "../ui/skeleton";

export function PieChartDonut({ user_id }) {
	const { loading, setLoading } = useLoadContext();

	const [chartData, setChartData] = useState([]);

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
	useEffect(() => {
		if (!user_id) return;
		fetchData();
	}, [user_id]);

	const fetchData = async () => {
		setLoading(true);
		try {
			// Fetch user tasks by status
			const response = await axiosClient.get(`/tasks-by-status/${user_id}`);
			setChartData(response.data);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			setLoading(false);
		}
	};
	const totalVisitors = useMemo(() => {
		return chartData.reduce((acc, curr) => acc + curr.tasks, 0);
	}, [chartData]);

	return (
		<Card className="flex flex-col h-full">
			<CardHeader className="items-center pb-0">
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
							<Pie data={chartData} dataKey="tasks" nameKey="status" innerRadius={60} strokeWidth={5}>
								<Label
									content={({ viewBox }) => {
										if (viewBox && "cx" in viewBox && "cy" in viewBox) {
											return (
												<text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
													<tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
														{totalVisitors.toLocaleString()}
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
				{chartData?.length > 0 ? (
					<div className="flex flex-wrap justify-center items-center gap-4 leading-none text-muted-foreground">
						{chartData.map((data, index) => (
							<div key={index} className="flex items-center gap-1">
								<span className="font-bold">{data.tasks}</span> {chartConfig[data.status]?.label || data.status}
							</div>
						))}
					</div>
				) : (
					<div className="leading-none text-muted-foreground">Showing all total tasks</div>
				)}
			</CardFooter>
		</Card>
	);
}
