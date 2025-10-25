"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "../ui/skeleton";
import { useLoadContext } from "@/contexts/LoadContextProvider";

export function ChartPieLabel({ report, title = "Overrun / Underrun / On Time" }) {
	const { loading, setLoading } = useLoadContext();

	const chartConfig = {
		value: {
			label: "Tasks",
		},
		underrun: {
			label: "Underrun",
			color: "hsl(var(--chart-1))",
			// color: "hsl(160 60% 45%)", // Green
		},
		overrun: {
			label: "Overrun",
			color: "hsl(var(--chart-10))",
			// color: "hsl(30 80% 55%)", // Yellow
		},
		on_time: {
			label: "On Time",
			color: "hsl(270 70% 50%)", // Purple
			// color: "hsl(220 70% 50%)", // Blue
		},
	};
	const chartData =
		report && Array.isArray(report.chart_data)
			? report.chart_data.map((d, i) => ({
					name: d.label ?? `Slice ${i + 1}`,
					value: typeof d.value !== "undefined" ? d.value : d.count ?? 0,
					count: d.count ?? 0,
					// Map colors based on label
					fill: d.label === "Underrun" ? chartConfig.underrun.color : d.label === "Overrun" ? chartConfig.overrun.color : chartConfig.on_time.color,
			  }))
			: [];
	const total = report?.total_tasks ?? chartData.reduce((s, it) => s + (it.count || 0), 0);

	return (
		<Card className={`flex flex-col relative w-full h-full justify-between rounded-2xl`}>
			<CardHeader className="items-center text-center pb-0">
				<CardTitle className="text-lg">{title}</CardTitle>
				<CardDescription>
					{report?.filters && report.filters.from && report.filters.to
						? `${new Date(report.filters.from).toLocaleDateString()} - ${new Date(report.filters.to).toLocaleDateString()}`
						: "All Time"}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer config={chartConfig} className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0">
					{loading ? (
						<div className="flex items-center justify-center h-full w-full p-8">
							<Skeleton className=" w-full h-full rounded-full" />
						</div>
					) : chartData.data_count == 0 ? (
						<div className="flex items-center justify-center fw-full h-full text-lg text-gray-500">No Tasks Yet</div>
					) : (
						<PieChart>
							<ChartTooltip content={<ChartTooltipContent hideLabel />} />
							<Pie
								data={chartData}
								dataKey="value"
								nameKey="name"
								label={{
									fill: "var(--foreground)",
									fontSize: 12,
								}}
							/>
						</PieChart>
					)}
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col gap-2 text-sm">
				{loading ? (
					<div className="flex flex-col gap-2 items-center justify-center h-full w-full p-8">
						<Skeleton className=" w-full h-4" />
						<Skeleton className=" w-full h-4" />
					</div>
				) : chartData.data_count == 0 ? (
					""
				) : (
					<div className="flex flex-wrap justify-center items-center gap-4 leading-none text-muted-foreground">
						<div className="flex items-center gap-2 leading-none font-medium">Total tasks: {total}</div>
						{/* // <div key={index} className="flex items-center gap-1">
							// 	<span className="font-bold">{data.tasks}</span> {chartConfig[data.status]?.label || data.status}
							// </div> */}
					</div>
				)}
				{/* <div className="text-muted-foreground leading-none">Showing overrun / underrun distribution</div> */}
			</CardFooter>
		</Card>
	);
}
