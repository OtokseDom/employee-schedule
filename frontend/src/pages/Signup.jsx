import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContextProvider";
import axiosClient from "../axios.client";
import { Loader2 } from "lucide-react";
import { useLoadContext } from "@/contexts/LoadContextProvider";

export default function Signup() {
	const { loading, setLoading } = useLoadContext();
	const [errors, setErrors] = useState(null);
	const { setUser, setToken } = useAuthContext();

	const [hasOrgCode, setHasOrgCode] = useState(true); // toggle between code or new org
	const orgCodeRef = useRef();
	const orgNameRef = useRef();
	const nameRef = useRef();
	const emailRef = useRef();
	const positionRef = useRef();
	const dobRef = useRef();
	const passwordRef = useRef();
	const passwordConfiramtionRef = useRef();
	useEffect(() => {
		document.title = "Task Management | Sign Up";
	}, []);

	const onSubmit = (e) => {
		setLoading(true);
		e.preventDefault();
		const payload = {
			name: nameRef.current.value,
			role: "Employee",
			email: emailRef.current.value,
			position: positionRef.current.value,
			dob: dobRef.current.value,
			password: passwordRef.current.value,
			password_confirmation: passwordConfiramtionRef.current.value,
		};
		if (hasOrgCode) {
			payload.organization_code = orgCodeRef.current.value;
		} else {
			payload.organization_name = orgNameRef.current.value;
		}
		axiosClient
			.post("/signup", payload)
			.then(({ data }) => {
				// response will contain headers, status codes, data, ec
				// just extract data
				setUser(data.data.user);
				setToken(data.data.token);

				setLoading(false);
			})
			.catch((err) => {
				const response = err.response;
				if (response && response.status === 422) {
					// Validation error
					setErrors(response.data.errors);
				} else {
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
						<div className="alert text-sm text-red-600 space-y-1">
							{Object.keys(errors).map((field) => errors[field].map((msg, index) => <p key={`${field}-${index}`}>{msg}</p>))}
						</div>
					)}

					<div className="mb-4">
						<label className="block text-sm mb-1">Organization</label>
						{hasOrgCode ? (
							<input ref={orgCodeRef} type="text" placeholder="Enter Organization Code" className="bg-background text-foreground" required />
						) : (
							<input ref={orgNameRef} type="text" placeholder="Enter New Organization Name" className="bg-background text-foreground" required />
						)}

						<button type="button" className="mt-2 text-sm text-muted-foreground underline" onClick={() => setHasOrgCode((prev) => !prev)}>
							{hasOrgCode ? "Don't have a code? Create a new organization" : "Have a code? Join existing organization"}
						</button>
					</div>
					<input className="bg-background text-foreground" ref={nameRef} type="text" placeholder="Full Name" />
					<input className="bg-background text-foreground" ref={emailRef} type="email" placeholder="Email" />
					<input className="bg-background text-foreground" ref={positionRef} type="text" placeholder="Position" />
					<input className="bg-background text-foreground" ref={dobRef} type="date" placeholder="Date of Birth" />
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
