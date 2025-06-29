"use client";

import { Star, TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { Skeleton } from "../ui/skeleton";

const chartConfig = {
	value: {
		label: "AVG Rating",
		color: "hsl(var(--chart-1))",
	},
};

export function RadarChartGridFilled({ report }) {
	const { loading, setLoading } = useLoadContext();
	return (
		<Card className="flex flex-col relative h-full">
			<CardHeader className="items-center text-center pb-4">
				<CardTitle>AVG Rating Per Category</CardTitle>
				<CardDescription>Showing all categories</CardDescription>
			</CardHeader>
			<CardContent className="pb-0">
				<ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
					{loading ? (
						<div className="flex items-center justify-center h-full w-full p-8">
							<Skeleton className=" w-full h-full rounded-full" />
						</div>
					) : (
						<RadarChart data={report?.ratings?.length > 0 ? report?.ratings : []} outerRadius={90} width={300} height={300}>
							<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
							<PolarGrid className="fill-[--color-value] opacity-20" />
							<PolarAngleAxis dataKey="category" />
							<Radar dataKey="value" fill="var(--color-value)" fillOpacity={0.5} />
						</RadarChart>
					)}
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col gap-2 text-sm">
				<div className="flex items-center gap-2 font-medium leading-none">
					<Star className="h-4 w-4" /> {report?.highest_rating?.category} has the highest rating of {report?.highest_rating?.value}
				</div>
				<div className="flex items-center gap-2 leading-none text-muted-foreground">All Time</div>
			</CardFooter>
		</Card>
	);
}
