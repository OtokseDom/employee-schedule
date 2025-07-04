import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

export function SectionCards() {
	return (
		// <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
		<div className="flex flex-col lg:flex-row gap-10">
			<Card className="@container/card w-full bg-primary-foreground">
				<CardHeader>
					<div className="flex flex-row justify-between items-center">
						<CardDescription>All Time Performance Rating</CardDescription>
						<Badge variant="outline" className="gap-1">
							<TrendingUp size={12} /> +12.5%
						</Badge>
					</div>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">8.9</CardTitle>
					{/* <CardAction> */}
					{/* </CardAction> */}
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Trending up this month <TrendingUp className="size-4" />
					</div>
					<div className="text-muted-foreground">Average rating score for all rated tasks</div>
				</CardFooter>
			</Card>
			<Card className="@container/card w-full bg-primary-foreground">
				<CardHeader>
					<div className="flex flex-row justify-between items-center">
						<CardDescription>Total Tasks</CardDescription>
						<Badge variant="outline" className="gap-1">
							<TrendingUp size={12} /> +12.5% this week
						</Badge>
					</div>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">91</CardTitle>
					{/* <CardAction> */}
					{/* </CardAction> */}
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Trending up this week <TrendingUp className="size-4" />
					</div>
					<div className="text-muted-foreground">All time assigned tasks</div>
				</CardFooter>
			</Card>
			<Card className="@container/card w-full bg-primary-foreground">
				<CardHeader>
					<div className="flex flex-row justify-between items-center">
						<CardDescription>Total Revenue</CardDescription>
						<Badge variant="outline" className="gap-1">
							<TrendingUp size={12} /> +12.5%
						</Badge>
					</div>
					<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">$1,250.00</CardTitle>
					{/* <CardAction> */}
					{/* </CardAction> */}
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Trending up this month <TrendingUp className="size-4" />
					</div>
					<div className="text-muted-foreground">Visitors for the last 6 months</div>
				</CardFooter>
			</Card>
		</div>
	);
}
