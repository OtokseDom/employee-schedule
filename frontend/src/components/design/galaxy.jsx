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
		dob = "Unknown",
	} = user || {};

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		const stars = [];
		let time = 0;
		const flickerSpeed = 0.5; // Very slow flickering

		// Monochrome color palette
		const monochromeColors = ["#0A0A2A", "#14143C", "#1E1E46", "#28284E", "#323256", "#3C3C5E"];

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
					color: `rgba(220, 220, 255, ${brightness})`,
					speed: Math.random() * 0.5,
				});
			}
		};

		// Create nebula effect with flickering
		const drawNebula = (currentTime) => {
			const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);

			gradient.addColorStop(0, "rgba(30, 30, 60, 0.5)");
			gradient.addColorStop(0.5, "rgba(40, 40, 70, 0.3)");
			gradient.addColorStop(1, "rgba(10, 10, 30, 0)");

			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Draw each cloud with flickering
			nebulaClouds.forEach((cloud, i) => {
				// Calculate flickering opacity based on time
				const flickerAmount = Math.sin(currentTime + cloud.phase) * 0.3 + 0.7; // More noticeable flicker

				const nebulaGradient = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius);

				const color = monochromeColors[cloud.colorIndex];
				const alpha = Math.floor(80 * flickerAmount); // Convert to 0-80 range
				const alphaHex = alpha.toString(16).padStart(2, "0"); // Convert to hex

				nebulaGradient.addColorStop(0, `${color}${alphaHex}`);
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
			ctx.fillStyle = "#050518";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Update time for flickering
			time += flickerSpeed;

			// Draw nebula with current time
			drawNebula(time);

			// Draw and update stars
			stars.forEach((star) => {
				ctx.beginPath();
				ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
				ctx.fillStyle = star.color;
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
	}, []);

	return (
		<div className="relative w-full h-52 md:h-60 overflow-hidden rounded-lg shadow-lg mb-5">
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
							{user_auth?.role === "Superadmin" && (
								<Dialog>
									<DropdownMenu modal={false}>
										<DropdownMenuTrigger asChild>
											<Button variant="outline" className="flex items-center">
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
						<div className="flex mt-4 space-x-4">
							<div className="bg-purple-900/50 backdrop-blur-sm px-3 py-1 rounded-full text-purple-100">✨{role}</div>
							<div className="bg-indigo-900/50 backdrop-blur-sm px-3 py-1 rounded-full text-indigo-100">🌌 {email}</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
