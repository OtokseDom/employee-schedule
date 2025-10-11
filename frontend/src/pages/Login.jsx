import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios.client";
import { useAuthContext } from "../contexts/AuthContextProvider";
import { Loader2, Sun, Moon } from "lucide-react";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { API } from "@/constants/api";
import { useToast } from "@/contexts/ToastContextProvider";
import { Button } from "@/components/ui/button";

export default function Login() {
	const { loading, setLoading } = useLoadContext();
	const showToast = useToast();
	const [errors, setErrors] = useState(null);
	const { setUser, setToken } = useAuthContext();
	const emailRef = useRef();
	const passwordRef = useRef();
	const canvasRef = useRef(null);

	// Track theme (dark/light) by observing <html> class changes
	const [theme, setTheme] = useState(() => (document.documentElement.classList.contains("dark") ? "dark" : "light"));

	useEffect(() => {
		document.title = "Task Management | Log In";
	}, []);

	useEffect(() => {
		const observer = new MutationObserver(() => {
			const isDark = document.documentElement.classList.contains("dark");
			setTheme(isDark ? "dark" : "light");
		});
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, []);

	const onsubmit = (e) => {
		setLoading(true);
		e.preventDefault();
		const payload = {
			email: emailRef.current.value,
			password: passwordRef.current.value,
		};
		axiosClient
			.post(API().login, payload)
			.then(({ data }) => {
				if (data.user.status == "pending") {
					showToast("Login Failed", "Your request has not been approved yet.", 10000, "warning");
				} else if (data.user.status == "rejected") {
					showToast("Login Failed", "Your request to join has been rejected by the organization.", 10000, "fail");
				} else if (data.user.status == "inactive") {
					showToast("Login Failed", "Your account is no longer active. Ask your organization to reactivate it.", 10000, "warning");
				} else if (data.user.status == "banned") {
					showToast("Login Failed", "Your account has been banned from this organization.", 10000, "fail");
				} else {
					setUser(data.user);
					setToken(data.token);
				}
				setLoading(false);
			})
			.catch((err) => {
				const response = err.response;
				if (response && response.status === 422) {
					if (response.data.errors) {
						setErrors(response.data.errors);
					} else {
						setErrors({
							email: [response.data.message],
						});
					}
				} else {
					console.log(response);
				}
				setLoading(false);
			});
	};

	return (
		<div className="inset-0 flex items-center justify-center min-h-screen overflow-hidden">
			<div className="flex flex-col text-center mb-8 gap-10">
				<h1 className={`text-3xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>Access my website at</h1>
				<a href="https://otokse.lidta.com">
					<Button size="lg" className="text-2xl">
						otokse.lidta.com ↗️
					</Button>
				</a>
				<p className="text-lg">for Faster and Improved user experience 😁</p>
			</div>
		</div>
	);
}
