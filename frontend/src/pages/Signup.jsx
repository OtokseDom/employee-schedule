import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContextProvider";
import axiosClient from "../axios.client";
import { Loader2 } from "lucide-react";

export default function Signup() {
	const [errors, setErrors] = useState(null);
	const { setUser, setToken } = useAuthContext();
	const [loading, setLoading] = useState(false);

	const nameRef = useRef();
	const emailRef = useRef();
	const passwordRef = useRef();
	const passwordConfiramtionRef = useRef();

	const onSubmit = (e) => {
		setLoading(true);
		e.preventDefault();
		const payload = {
			name: nameRef.current.value,
			role: "Employee",
			email: emailRef.current.value,
			password: passwordRef.current.value,
			password_confirmation: passwordConfiramtionRef.current.value,
		};
		axiosClient
			.post("/signup", payload)
			.then(({ data }) => {
				// response will contain headers, status codes, data, ec
				// just extract data
				setUser(data.user);
				setToken(data.token);
				setLoading(false);
			})
			.catch((err) => {
				const response = err.response;
				if (response && response.status === 422) {
					// Validation error
					console.log(response.data.errors);
					setErrors(response.data.errors);
				}
				setLoading(false);
			});
	};
	return (
		<div className="login-signup-form animated fadeInDown">
			<div className="form bg-secondary">
				<form onSubmit={onSubmit}>
					<h1 className="title">Signup for Free</h1>
					{errors && (
						<div className="alert">
							{Object.keys(errors).map((key) => (
								<p key={key}>{errors[key][0]}</p>
							))}
						</div>
					)}
					<input className="bg-background text-foreground" ref={nameRef} type="text" placeholder="Full Name" />
					<input className="bg-background text-foreground" ref={emailRef} type="email" placeholder="Email" />
					<input className="bg-background text-foreground" ref={passwordRef} type="password" placeholder="Password" />
					<input className="bg-background text-foreground" ref={passwordConfiramtionRef} type="password" placeholder="Password Confirmation" />
					<button className="btn btn-block flex justify-center">{loading && <Loader2 className="animate-spin mr-5 -ml-11" />} Sign Up</button>
					<p className="message text-muted-foreground">
						Already Registered?{" "}
						<Link to="/login" className="text-foreground">
							Login
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
