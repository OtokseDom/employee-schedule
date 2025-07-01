"use client";

import { CheckCircle, ClockAlert, Hourglass, PartyPopper, TrendingDown, TrendingUp, TriangleAlert, Zap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export const description = "A multiple bar chart";

const chartData = [
	{ task: "January", estimate: 186, actual: 80 },
	{ task: "February", estimate: 305, actual: 200 },
	{ task: "March", estimate: 237, actual: 120 },
	{ task: "April", estimate: 73, actual: 190 },
	{ task: "May", estimate: 209, actual: 130 },
	{ task: "June", estimate: 214, actual: 140 },
	{ task: "June", estimate: 214, actual: 140 },
	{ task: "June", estimate: 214, actual: 140 },
	{ task: "June", estimate: 214, actual: 140 },
	{ task: "June", estimate: 214, actual: 140 },
];

const chartConfig = {
	estimate: {
		label: "Estimate (hr) ",
		color: "hsl(var(--chart-1))",
	},
	actual: {
		label: "Actual (hr) ",
		color: "hsl(270 70% 50%)", // Purple
	},
};

export function ChartBarMultiple({ report }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Estimate vs Actual Time</CardTitle>
				<CardDescription>Showing 10 most recent tasks</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart accessibilityLayer data={report?.chart_data}>
						<CartesianGrid vertical={false} />
						<XAxis dataKey="task" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
						<ChartTooltip cursor={true} content={<ChartTooltipContent indicator="line" />} />
						<Bar dataKey="estimate" fill="var(--color-estimate)" radius={4} />
						<Bar dataKey="actual" fill="var(--color-actual)" radius={4} />
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				{/* Overruns */}
				{report?.runs["over"] > 0 ? (
					<div className="flex gap-2 leading-none font-medium">
						Total Overruns:
						<span className="flex flex-row gap-4 text-red-500">
							{report.runs["over"]} <ClockAlert className="h-4 w-4" />
						</span>
					</div>
				) : (
					<div className="text-green-500 leading-none italic flex flex-row gap-2">
						🎉 No overruns <span className="text-muted-foreground">— great time control!</span>
					</div>
				)}

				{/* Underruns */}
				{Math.abs(report?.runs["under"]) > 0 ? (
					<div className="flex gap-2 leading-none font-medium">
						Total Underruns:
						<span className="flex flex-row gap-4 text-green-500">
							{Math.abs(report.runs["under"])} <Zap className="h-4 w-4" />
						</span>
					</div>
				) : (
					<div className="flex flex-row gap-2 text-red-500 leading-none italic">
						⚠️ No tasks finished early <span className="text-muted-foreground">— consider buffer time.</span>
					</div>
				)}

				{/* On-Time Tasks */}
				{report?.runs["exact"] > 0 ? (
					<div className="flex gap-2 leading-none font-medium">
						Tasks finished on exact time:
						<span className="flex flex-row gap-4 text-blue-500">
							{Math.abs(report.runs["exact"])} <CheckCircle className="h-4 w-4" />
						</span>
					</div>
				) : (
					<div className="flex flex-row gap-2 text-muted-foreground leading-none italic">⌛ No exact matches — review your estimates?</div>
				)}
			</CardFooter>
		</Card>
	);
}
