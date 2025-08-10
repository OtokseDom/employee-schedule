import React, { useState, useEffect } from "react";

export default function GalaxyProgressBar({ progress = 0, label = "Overall Progress", showPercentage = true }) {
	const [animatedProgress, setAnimatedProgress] = useState(0);

	// Track theme (dark/light) by observing <html> class changes
	const [theme, setTheme] = useState(() => (document.documentElement.classList.contains("dark") ? "dark" : "light"));

	useEffect(() => {
		const observer = new MutationObserver(() => {
			const isDark = document.documentElement.classList.contains("dark");
			setTheme(isDark ? "dark" : "light");
		});
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, []);

	// Pull palette from CSS variables
	const style = getComputedStyle(document.documentElement);
	const getVar = (name, fallback = "#000") => style.getPropertyValue(name).trim() || fallback;

	const galaxyColors = [
		getVar("--galaxy-nebula-1"),
		getVar("--galaxy-nebula-2"),
		getVar("--galaxy-nebula-3"),
		getVar("--galaxy-nebula-4"),
		getVar("--galaxy-nebula-5"),
		getVar("--galaxy-nebula-6"),
	];
	const galaxyStar = getVar("--galaxy-star", "#e5d4ff"); // soft lavender white
	const galaxyBg = getVar("--galaxy-bg", theme === "dark" ? "#1a1025" : "#faf5ff"); // deep purple or light lilac
	const galaxyGradient0 = getVar("--galaxy-gradient-0", "rgba(196, 128, 255, 0.25)"); // light amethyst
	const galaxyGradient05 = getVar("--galaxy-gradient-05", "rgba(180, 100, 255, 0.15)"); // soft purple glow
	const galaxyGradient1 = getVar("--galaxy-gradient-1", "rgba(150, 80, 255, 0.08)"); // faint violet haze

	// Animate progress changes
	useEffect(() => {
		const timer = setTimeout(() => {
			setAnimatedProgress(progress);
		}, 100);
		return () => clearTimeout(timer);
	}, [progress]);

	// Generate background stars
	const generateStars = (count) =>
		Array.from({ length: count }, (_, i) => ({
			id: i,
			left: Math.random() * 100,
			top: Math.random() * 100,
			size: Math.random() * 2 + 1,
		}));

	const [stars] = useState(generateStars(12));

	return (
		<div
			className="w-full mx-auto p-5 backdrop-blur-sm rounded-md border relative overflow-hidden"
			style={{
				background: `linear-gradient(to bottom right, ${galaxyGradient05}, ${galaxyGradient1}), ${galaxyBg}`,
				borderColor: galaxyColors[2],
				// boxShadow: `0 0 5px ${galaxyColors[6]}55`,
			}}
		>
			{/* Purple tint overlay */}
			<div
				className="absolute inset-0 pointer-events-none z-[5]"
				style={{
					backgroundColor: "rgba(120, 0, 128, 0.05)", // adjust alpha for intensity
					mixBlendMode: "screen", // try 'overlay', 'screen', or 'soft-light'
				}}
			></div>
			{/* Background stars */}
			{stars.map((star) => (
				<div
					key={star.id}
					className="absolute rounded-full animate-pulse"
					style={{
						backgroundColor: galaxyStar,
						left: `${star.left}%`,
						top: `${star.top}%`,
						width: `${star.size}px`,
						height: `${star.size}px`,
						animationDuration: `${2 + Math.random() * 2}s`,
					}}
				/>
			))}

			{/* Label */}
			<div className="mb-3 relative z-10">
				<h3 className="text-lg font-semibold" style={{ color: stars }}>
					{label}
				</h3>
			</div>

			{/* Progress Bar */}
			<div className="relative z-10">
				{/* Background track */}
				<div
					className="h-3 rounded-full border overflow-hidden relative"
					style={{
						backgroundColor: `${galaxyColors[1]}55`,
						borderColor: `${galaxyColors[4]}88`,
					}}
				>
					{/* Progress fill */}
					<div
						className="h-full rounded-full transition-all duration-1000 ease-out relative"
						style={{
							width: `${Math.min(animatedProgress, 100)}%`,
							background: `linear-gradient(to right, ${galaxyColors.join(",")})`,
						}}
					>
						{/* Shine effect */}
						<div
							className="absolute inset-0 animate-shimmer"
							style={{
								background: `linear-gradient(to right, transparent, ${galaxyGradient0}, transparent)`,
							}}
						/>
						{/* Glow effect */}
						<div
							className="absolute inset-0 blur-sm"
							style={{
								background: `linear-gradient(to right, ${galaxyColors[0]}55, ${galaxyColors[2]}55)`,
							}}
						/>
					</div>
				</div>

				{/* Percentage display */}
				{showPercentage && (
					<div className="flex justify-end mt-2">
						<span className="text-sm font-medium" style={{ color: galaxyColors[6] }}>
							{animatedProgress}%
						</span>
					</div>
				)}
			</div>

			<style>{`
				@keyframes shimmer {
					0% {
						transform: translateX(-100%);
					}
					100% {
						transform: translateX(100%);
					}
				}
				.animate-shimmer {
					animation: shimmer 2.5s infinite;
				}
			`}</style>
		</div>
	);
}
