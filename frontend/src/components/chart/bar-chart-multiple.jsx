"use client";

import { CheckCircle, ClockAlert, Zap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "../ui/skeleton";
import { useLoadContext } from "@/contexts/LoadContextProvider";

export function ChartBarMultiple({ report, variant }) {
	var chartConfig = null;
	if (variant == "dashboard") {
		chartConfig = {
			underrun: {
				label: "Underrun (hr) ",
				color: "hsl(var(--chart-1))",
			},
			overrun: {
				label: "Overrun (hr) ",
				color: "hsl(270 70% 50%)", // Purple
			},
		};
	} else {
		chartConfig = {
			estimate: {
				label: "Estimate (hr) ",
				color: "hsl(var(--chart-1))",
			},
			actual: {
				label: "Actual (hr) ",
				color: "hsl(270 70% 50%)", // Purple
			},
		};
	}
	const { loading } = useLoadContext();
	return (
		<Card className={`flex flex-col relative w-full h-full justify-between ${variant == "dashboard" ? "bg-primary-foreground rounded-2xl" : ""}`}>
			<CardHeader>
				<CardTitle>{variant == "dashboard" ? "Task Underruns vs Overruns per Category" : "Estimate vs Actual Time"}</CardTitle>
				<CardDescription>
					Underruns: Tasks finished earlier than estimated <br /> Overruns: Tasks took longer than estimated
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
					) : (
						<BarChart accessibilityLayer data={report?.chart_data}>
							<CartesianGrid vertical={false} />
							<XAxis
								dataKey={variant == "dashboard" ? "category" : "task"}
								tickLine={false}
								tickMargin={10}
								axisLine={false}
								tickFormatter={(value) => value.slice(0, 3)}
							/>
							<ChartTooltip cursor={true} content={<ChartTooltipContent indicator="line" />} />
							{variant == "dashboard" ? (
								<>
									<Bar dataKey="underrun" fill="var(--color-underrun)" radius={4} />
									<Bar dataKey="overrun" fill="var(--color-overrun)" radius={4} />
								</>
							) : (
								<>
									<Bar dataKey="estimate" fill="var(--color-estimate)" radius={4} />
									<Bar dataKey="actual" fill="var(--color-actual)" radius={4} />
								</>
							)}
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
				) : (
					<>
						<div className="flex flex-row gap-2 text-muted-foreground leading-none">
							Showing {report?.task_count} {variant == "dashboard" ? "categories" : "most recent tasks"}
						</div>
						{/* Underruns */}
						{Math.abs(report?.runs["under"]) > 0 ? (
							<div className="flex gap-2 leading-none font-medium">
								Total Underruns (hrs):
								<span className="flex flex-row gap-4 text-green-500">
									{Math.abs(report.runs["under"])} <Zap className="h-4 w-4" />
								</span>
							</div>
						) : (
							<div className="flex flex-row gap-2 text-red-500 leading-none italic">
								⚠️ No tasks finished early <span className="text-muted-foreground">— consider buffer time.</span>
							</div>
						)}

						{/* Overruns */}
						{(variant == "dashboard" && report?.runs["over"] > 0) || (variant != "dashboard" && report?.runs["over"] < 0) ? (
							<div className="flex gap-2 leading-none font-medium">
								Total Overruns (hrs):
								<span className="flex flex-row gap-4 text-red-500">
									{report.runs["over"]} <ClockAlert className="h-4 w-4" />
								</span>
							</div>
						) : (
							<div className="text-green-500 leading-none italic flex flex-row gap-2">
								🎉 No overruns <span className="text-muted-foreground">— great time control!</span>
							</div>
						)}

						{/* On-Time Tasks */}
						{variant == "dashboard" ? (
							""
						) : report?.runs["exact"] > 0 ? (
							<div className="flex gap-2 leading-none font-medium">
								Tasks finished on exact time:
								<span className="flex flex-row gap-4 text-blue-500">
									{Math.abs(report.runs["exact"])} <CheckCircle className="h-4 w-4" />
								</span>
							</div>
						) : (
							<div className="flex flex-row gap-2 text-muted-foreground leading-none italic">No exact matches — review your estimates?</div>
						)}
					</>
				)}
			</CardFooter>
		</Card>
	);
}
