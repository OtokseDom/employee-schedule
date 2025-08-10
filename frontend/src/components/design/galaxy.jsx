"use client";
import React, { useEffect, useRef, useState } from "react";

export default function GalaxyProfileBanner({ children }) {
	const canvasRef = useRef(null);

	// Debounce utility for resize
	function debounce(fn, ms) {
		let timer;
		return (...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => fn(...args), ms);
		};
	}

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
		// Use willReadFrequently for Firefox performance
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		const stars = [];
		let time = 0;
		const flickerSpeed = 0.08; // Slightly slower flickering

		// Get palette from CSS variables
		const isDarkMode = theme === "dark";
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
		const galaxyStar = getVar("--galaxy-star", "#ffffff");
		const galaxyBg = getVar("--galaxy-bg", "#000000");
		const galaxyGradient0 = getVar("--galaxy-gradient-0", "rgba(255,255,255,0.2)");
		const galaxyGradient05 = getVar("--galaxy-gradient-05", "rgba(255,255,255,0.1)");
		const galaxyGradient1 = getVar("--galaxy-gradient-1", "rgba(255,255,255,0.05)");

		// Cloud positions and properties (fixed so they don't regenerate each frame)
		const nebulaClouds = [
			{ x: 0, y: 0, radius: 0, colorIndex: 0, phase: 0 },
			{ x: 0, y: 0, radius: 0, colorIndex: 2, phase: 2 },
			{ x: 0, y: 0, radius: 0, colorIndex: 4, phase: 4 },
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
			// Invalidate nebula gradients
			nebulaGradients.forEach((_, i) => (nebulaGradients[i] = null));
		};
		const debouncedResize = debounce(resizeCanvas, 120);

		// Create stars
		const createStars = () => {
			stars.length = 0;
			// Lower star count for performance
			const baseDensity = isDarkMode ? 0.00018 : 0.00012; // Fewer stars for light mode
			const starCount = Math.max(40, Math.floor(canvas.width * canvas.height * baseDensity));

			for (let i = 0; i < starCount; i++) {
				const brightness = Math.random() * 0.5 + 0.5;
				stars.push({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					radius: Math.random() * 1.2 + 0.3,
					color: isDarkMode ? `rgba(220, 220, 255, ${brightness})` : `rgba(255, 200, 80, ${brightness})`,
					speed: Math.random() * 1.5 + 0.2,
				});
			}
		};

		// Create nebula effect with flickering
		const nebulaGradients = nebulaClouds.map(() => null);
		const drawNebula = (currentTime) => {
			// Only create the background gradient once per resize
			if (!drawNebula.bgGradient || drawNebula.bgW !== canvas.width || drawNebula.bgH !== canvas.height) {
				drawNebula.bgGradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
				drawNebula.bgGradient.addColorStop(0, galaxyGradient0);
				drawNebula.bgGradient.addColorStop(0.5, galaxyGradient05);
				drawNebula.bgGradient.addColorStop(1, galaxyGradient1);
				drawNebula.bgW = canvas.width;
				drawNebula.bgH = canvas.height;
			}
			ctx.fillStyle = drawNebula.bgGradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Draw each cloud with flickering
			nebulaClouds.forEach((cloud, i) => {
				const flickerAmount = Math.sin(currentTime + cloud.phase) * 0.25 + 0.75;
				// Only recreate gradient if cloud position/size changes
				if (!nebulaGradients[i] || nebulaGradients[i].x !== cloud.x || nebulaGradients[i].y !== cloud.y || nebulaGradients[i].radius !== cloud.radius) {
					const nebulaGradient = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius);
					const color = galaxyColors[cloud.colorIndex];
					if (isDarkMode) {
						const alpha = Math.floor(80 * flickerAmount);
						const alphaHex = alpha.toString(16).padStart(2, "0");
						nebulaGradient.addColorStop(0, `${color}${alphaHex}`);
					} else {
						const r = parseInt(color.substring(1, 3), 16);
						const g = parseInt(color.substring(3, 5), 16);
						const b = parseInt(color.substring(5, 7), 16);
						nebulaGradient.addColorStop(0, `rgba(${r},${g},${b},${flickerAmount * 0.7})`);
					}
					nebulaGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
					nebulaGradients[i] = { gradient: nebulaGradient, x: cloud.x, y: cloud.y, radius: cloud.radius };
				}
				ctx.fillStyle = nebulaGradients[i].gradient;
				ctx.beginPath();
				ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
				ctx.fill();
			});
		};

		// Animation function
		let running = true;
		const animate = () => {
			if (!running) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Background
			ctx.fillStyle = galaxyBg;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Update time for flickering
			time += flickerSpeed;

			// Draw nebula with current time
			drawNebula(time);

			// Draw and update stars
			for (let i = 0; i < stars.length; i++) {
				const star = stars[i];
				ctx.beginPath();
				ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
				ctx.fillStyle = galaxyStar;
				ctx.fill();

				star.x += star.speed;
				if (star.x > canvas.width) star.x = 0;
			}

			requestAnimationFrame(animate);
		};

		// Initial setup
		resizeCanvas();
		window.addEventListener("resize", debouncedResize);
		animate();

		return () => {
			running = false;
			window.removeEventListener("resize", debouncedResize);
		};
	}, [theme]);

	return (
		<div className="relative w-full h-60 md:h-60 overflow-hidden rounded-2xl shadow-lg mb-5">
			<canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

			{children}
			{/* Content overlay */}
		</div>
	);
}
