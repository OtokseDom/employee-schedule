import { cn } from "@/lib/utils";

function Skeleton({ className, index = 0, style, ...props }) {
	// Calculate a staggered animation delay based on the index
	const animationDelay = `${index * 0.15}s`;
	return <div className={cn("animate-pulse rounded-md bg-muted", className)} style={{ animationDelay, ...style }} {...props} />;
}

export { Skeleton };
