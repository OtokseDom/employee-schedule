"use client";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import React, { useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContextProvider";
// Shadcn UI
import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";
import { Edit } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function GalaxyProfileBanner({ user, handleUpdateUser, handleDelete }) {
	const canvasRef = useRef(null);
	const { user: user_auth } = useAuthContext(); // Get authenticated user details
	const { loading } = useLoadContext();
	const {
		name = "Galactic Explorer",
		position = "Captain of the Starship",
		email = "captain@stardust.com",
		role = "Stardust Collector",
		status = "Active",
		dob = "Unknown",
	} = user || {};

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

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		const stars = [];
		let time = 0;
		const flickerSpeed = 0.1; // Very slow flickering

		// Get palette from CSS variables
		const style = getComputedStyle(document.documentElement);
		const isDarkMode = theme === "dark";
		const galaxyColors = [
			style.getPropertyValue("--galaxy-nebula-1").trim(),
			style.getPropertyValue("--galaxy-nebula-2").trim(),
			style.getPropertyValue("--galaxy-nebula-3").trim(),
			style.getPropertyValue("--galaxy-nebula-4").trim(),
			style.getPropertyValue("--galaxy-nebula-5").trim(),
			style.getPropertyValue("--galaxy-nebula-6").trim(),
		];
		const galaxyStar = style.getPropertyValue("--galaxy-star").trim();
		const galaxyBg = style.getPropertyValue("--galaxy-bg").trim();
		const galaxyGradient0 = style.getPropertyValue("--galaxy-gradient-0").trim();
		const galaxyGradient05 = style.getPropertyValue("--galaxy-gradient-05").trim();
		const galaxyGradient1 = style.getPropertyValue("--galaxy-gradient-1").trim();

		// Cloud positions and properties (fixed so they don't regenerate each frame)
		const nebulaClouds = [
			{
				x: canvas.width * 0.3,
				y: canvas.height * 0.4,
				radius: canvas.width / 4,
				colorIndex: 0,
				phase: 0,
			},
			{
				x: canvas.width * 0.7,
				y: canvas.height * 0.6,
				radius: canvas.width / 3,
				colorIndex: 2,
				phase: 2,
			},
			{
				x: canvas.width * 0.5,
				y: canvas.height * 0.3,
				radius: canvas.width / 3.5,
				colorIndex: 4,
				phase: 4,
			},
		];

		// Make canvas responsive
		const resizeCanvas = () => {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;

			// Update cloud positions on resize
			nebulaClouds[0].x = canvas.width * 0.3;
			nebulaClouds[0].y = canvas.height * 0.4;
			nebulaClouds[0].radius = canvas.width / 4;

			nebulaClouds[1].x = canvas.width * 0.7;
			nebulaClouds[1].y = canvas.height * 0.6;
			nebulaClouds[1].radius = canvas.width / 3;

			nebulaClouds[2].x = canvas.width * 0.5;
			nebulaClouds[2].y = canvas.height * 0.3;
			nebulaClouds[2].radius = canvas.width / 3.5;

			createStars();
		};

		// Create stars
		const createStars = () => {
			stars.length = 0;
			const starCount = Math.floor((canvas.width * canvas.height) / 300);

			for (let i = 0; i < starCount; i++) {
				const brightness = Math.random() * 0.5 + 0.5;
				stars.push({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					radius: Math.random() * 1.5,
					color: isDarkMode ? `rgba(220, 220, 255, ${brightness})` : `rgba(255, 200, 80, ${brightness})`, // yellowish for day
					speed: Math.random() * 3,
				});
			}
		};

		// Create nebula effect with flickering
		const drawNebula = (currentTime) => {
			const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);

			gradient.addColorStop(0, galaxyGradient0);
			gradient.addColorStop(0.5, galaxyGradient05);
			gradient.addColorStop(1, galaxyGradient1);

			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Draw each cloud with flickering
			nebulaClouds.forEach((cloud, i) => {
				// Calculate flickering opacity based on time
				const flickerAmount = Math.sin(currentTime + cloud.phase) * 0.3 + 0.7; // More noticeable flicker

				const nebulaGradient = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius);

				const color = galaxyColors[cloud.colorIndex];
				const alpha = Math.floor(80 * flickerAmount); // Convert to 0-80 range
				const alphaHex = alpha.toString(16).padStart(2, "0"); // Convert to hex

				if (isDarkMode) {
					nebulaGradient.addColorStop(0, `${color}${alphaHex}`);
				} else {
					// Convert hex to rgb
					const r = parseInt(color.substring(1, 3), 16);
					const g = parseInt(color.substring(3, 5), 16);
					const b = parseInt(color.substring(5, 7), 16);
					nebulaGradient.addColorStop(0, `rgba(${r},${g},${b},${flickerAmount * 0.7})`);
				}
				nebulaGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

				ctx.fillStyle = nebulaGradient;
				ctx.beginPath();
				ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
				ctx.fill();
			});
		};

		// Animation function
		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Background
			ctx.fillStyle = galaxyBg;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Update time for flickering
			time += flickerSpeed;

			// Draw nebula with current time
			drawNebula(time);

			// Draw and update stars
			stars.forEach((star) => {
				ctx.beginPath();
				ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
				ctx.fillStyle = galaxyStar;
				ctx.fill();

				// Move stars slightly
				star.x += star.speed;
				if (star.x > canvas.width) star.x = 0;
			});

			requestAnimationFrame(animate);
		};

		// Initial setup
		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);
		animate();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
		};
	}, [theme]);

	return (
		<div className="relative w-full h-60 md:h-60 overflow-hidden rounded-2xl shadow-lg mb-5">
			<canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

			{/* Content overlay */}
			<div className="absolute inset-0 flex flex-col justify-center items-start p-6 bg-gradient-to-r from-black/50 to-transparent">
				<div className="flex flex-col gap-3 w-full">
					{loading ? (
						<div className="flex gap-5">
							<Skeleton className="w-24 h-24 rounded-full" />
							<div className="flex flex-col gap-2">
								<Skeleton className="w-60 h-10 rounded-full" />
								<Skeleton className="w-60 h-10 rounded-full" />
							</div>
						</div>
					) : (
						<div className="flex items-start justify-between w-full">
							<div className="flex gap-5 items-center">
								<div>
									<div className="w-24 h-24 bg-foreground rounded-full"></div>
								</div>
								<div className="w-full">
									<span className="flex gap-3 text-md md:text-3xl  font-bold text-white mb-0 md:mb-2">{name}</span>
									<span className="text-xs md:text-lg text-purple-200">{position}</span>
								</div>
							</div>
							{user_auth?.role === "Superadmin" || user_auth?.id === user?.id ? (
								<Dialog>
									<DropdownMenu modal={false}>
										<DropdownMenuTrigger asChild>
											<Button variant="default" className="flex items-center bg-foreground text-background">
												<Edit size={20} />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdateUser(user)}>
												Update Account
											</DropdownMenuItem>
											<DropdownMenuItem>
												<DialogTrigger>Deactivate Account</DialogTrigger>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Are you absolutely sure?</DialogTitle>
											<DialogDescription>This action cannot be undone.</DialogDescription>
										</DialogHeader>
										<DialogFooter>
											<DialogClose asChild>
												<Button type="button" variant="secondary">
													Close
												</Button>
											</DialogClose>
											<Button onClick={() => handleDelete(user.id)}>Yes, delete</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							) : (
								""
							)}
						</div>
					)}
					{/* User stats */}
					{loading ? (
						<div className="flex gap-5">
							<Skeleton className="w-24 h-8 rounded-full" />
							<Skeleton className="w-24 h-8 rounded-full" />
						</div>
					) : (
						<div className="flex flex-wrap mt-4 gap-2 md:gap-4">
							<div
								className={`backdrop-blur-sm px-3 py-1 w-fit rounded-full flex  items-center
							${
								status == "pending"
									? "text-yellow-100 bg-yellow-900/50"
									: status == "active"
									? "text-green-100 bg-green-900/50"
									: status == "inactive"
									? "text-gray-100 bg-gray-900/50"
									: status == "banned"
									? "text-red-100 bg-red-900/50"
									: ""
							}`}
							>
								{status}
							</div>
							<div className="bg-purple-900/50 backdrop-blur-sm px-3 py-1 w-fit rounded-full flex  items-center text-purple-100">✨{role}</div>
							<div className="bg-indigo-900/50 backdrop-blur-sm px-3 py-1 w-fit rounded-full flex  items-center text-indigo-100">🌌 {email}</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
