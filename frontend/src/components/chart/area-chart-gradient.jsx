"use client";

import { RefreshCcw, TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import axiosClient from "@/axios.client";
import { Skeleton } from "../ui/skeleton";

const chartConfig = {
	task: {
		label: "Task",
		color: "hsl(var(--chart-1))",
	},
};

export function AreaChartGradient({ user_id }) {
	const { loading, setLoading } = useLoadContext();

	const [chartData, setChartData] = useState([]);
	useEffect(() => {
		if (!user_id) return;
		fetchData();
	}, [user_id]);

	const fetchData = async () => {
		setLoading(true);
		try {
			// Fetch user tasks by status
			const response = await axiosClient.get(`/task-activity-timeline/${user_id}`);
			setChartData(response.data);
		} catch (e) {
			console.error("Error fetching data:", e);
		} finally {
			setLoading(false);
		}
	};
	return (
		<Card className="flex flex-col relative h-full">
			<CardHeader>
				<CardTitle>Task Activity Timeline</CardTitle>
				<CardDescription>Total tasks assigned for the last 6 months</CardDescription>
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
					) : (
						<AreaChart
							accessibilityLayer
							data={chartData?.chart_data}
							margin={{
								left: 12,
								right: 12,
							}}
						>
							<CartesianGrid vertical={false} />
							<XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
							<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
							<defs>
								<linearGradient id="fillTask" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="var(--color-task)" stopOpacity={0.8} />
									<stop offset="95%" stopColor="var(--color-task)" stopOpacity={0.1} />
								</linearGradient>
								{/* <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
								<stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
							</linearGradient> */}
							</defs>
							{/* <Area dataKey="mobile" type="natural" fill="url(#fillMobile)" fillOpacity={0.4} stroke="var(--color-mobile)" stackId="a" /> */}
							<Area dataKey="tasks" type="natural" fill="url(#fillTask)" fillOpacity={0.4} stroke="var(--color-task)" stackId="a" />
						</AreaChart>
					)}
				</ChartContainer>
			</CardContent>
			<CardFooter>
				<div className="flex w-full items-start gap-2 text-sm">
					{loading ? (
						<div className="flex flex-col gap-2 items-center justify-center h-full w-full">
							<Skeleton className=" w-full h-4 rounded-full" />
							<Skeleton className=" w-full h-4 rounded-full" />
						</div>
					) : (
						<div className="grid gap-2">
							<div className="flex items-center gap-2 font-medium leading-none">
								{chartData?.percentage_difference?.event == "Increased" ? (
									<div className="flex items-center gap-2">
										<span>Trending up by {chartData?.percentage_difference?.value}% this month </span>
										<TrendingUp className="h-4 w-4" />
									</div>
								) : chartData?.percentage_difference?.event == "Decreased" ? (
									<div className="flex items-center gap-2">
										<span>Trending dropped by {chartData?.percentage_difference?.value}% this month </span>
										<TrendingDown className="h-4 w-4" />
									</div>
								) : chartData?.percentage_difference?.event == "Same" ? (
									<div className="flex items-center gap-2">
										<span>Same as last month </span>
										<RefreshCcw className="h-4 w-4" />
									</div>
								) : (
									""
								)}
							</div>
							{chartData?.chart_data?.length > 0 && (
								<div className="flex items-center gap-2 leading-none text-muted-foreground">
									{chartData?.chart_data?.length > 0 && chartData.chart_data[0].month} -{" "}
									{chartData?.chart_data?.length > 0 && chartData.chart_data[5].month}{" "}
									{chartData?.chart_data?.length > 0 && chartData.chart_data[5].year}
								</div>
							)}
						</div>
					)}
				</div>
			</CardFooter>
		</Card>
	);
}
