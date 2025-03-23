import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios.client";
import { useAuthContext } from "../contexts/AuthContextProvider";
import { Loader2 } from "lucide-react";
import { useLoadContext } from "@/contexts/LoadContextProvider";

export default function Login() {
	const { loading, setLoading } = useLoadContext();
	const [errors, setErrors] = useState(null);
	const { setUser, setToken } = useAuthContext();
	const emailRef = useRef();
	const passwordRef = useRef();

	const onsubmit = (e) => {
		setLoading(true);
		e.preventDefault();
		const payload = {
			email: emailRef.current.value,
			password: passwordRef.current.value,
		};
		axiosClient
			.post("/login", payload)
			.then(({ data }) => {
				// response will contain headers, status codes, data, ec
				// just extract data
				// console.log(data); {
				setUser(data.user);
				setToken(data.token);
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
		<div className="login-signup-form animated fadeInDown">
			<div className="form bg-secondary text-foreground">
				<form onSubmit={onsubmit}>
					<h1 className="title">Login into your account</h1>
					{errors && (
						<div className="alert">
							{Object.keys(errors).map((key) => (
								<p key={key}>{errors[key][0]}</p>
							))}
						</div>
					)}
					<input className="bg-background text-foreground" ref={emailRef} type="email" placeholder="Email" />
					<input className="bg-background text-foreground" ref={passwordRef} type="password" placeholder="Password" />
					<button className="btn btn-block flex justify-center">{loading && <Loader2 className="animate-spin mr-5 -ml-11" />} Login</button>
					<p className="message text-muted-foreground">
						Not Registered?{" "}
						<Link to="/signup" className="text-foreground">
							Sign Up
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
