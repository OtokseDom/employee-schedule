import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

export function SectionCard({ description, value, showBadge = true, percentage, upward = true, insight, footer }) {
	return (
		// <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
		<div className="w-full">
			<Card className="bg-primary-foreground rounded-2xl">
				<CardHeader>
					<div className="flex flex-row justify-between items-center">
						<CardDescription>{description ? description : "N/A"}</CardDescription>
						{showBadge && (
							<Badge variant="outline" className="gap-1">
								{upward ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {percentage ? percentage : "N/A"}
							</Badge>
						)}
					</div>
					<CardTitle className="text-4xl font-semibold tabular-nums">{value ? value : "N/A"}</CardTitle>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					{insight ? (
						<div className="line-clamp-1 items-center flex gap-2 font-medium">
							{insight} {upward ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
						</div>
					) : (
						""
					)}
					<div className="text-muted-foreground">{footer ? footer : ""}</div>
				</CardFooter>
			</Card>
		</div>
	);
}
