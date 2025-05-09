import React, { createContext, useContext, useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { X } from "lucide-react";

const ToastContext = createContext();

export function ToastContextProvider({ children }) {
	const [toast, setToast] = useState({
		open: false,
		title: "",
		description: "",
		duration: 3000, // Default duration (3 sec)
		status: "success",
	});

	const showToast = (title, description, duration = 3000, status = "success") => {
		setToast({ open: true, title, description, duration, status });
	};

	return (
		<ToastContext.Provider value={showToast}>
			{children}
			<Toast.Provider swipeDirection="right">
				<Toast.Root
					className={`border ${
						toast.status == "success" ? "border-green-500" : toast.status == "fail" ? "border-red-800" : "border-foreground"
					} bg-background text-foreground w-64 p-4 rounded shadow-lg fixed top-4 right-4 animate-fadeIn z-[999]`}
					open={toast.open}
					onOpenChange={(open) => setToast((prev) => ({ ...prev, open }))}
					duration={toast.duration}
				>
					<div className="flex flex-row justify-between mb-2">
						<Toast.Title
							className={`font-bold ${
								toast.status == "success" ? "text-green-500" : toast.status == "fail" ? "text-red-800" : "text-foreground"
							}`}
						>
							{toast.title}
						</Toast.Title>
						<Toast.Action asChild altText="Close">
							<button className="ml-4 text-foreground">
								<X size={16} />
							</button>
						</Toast.Action>
					</div>
					<Toast.Description>{toast.description}</Toast.Description>
				</Toast.Root>
				<Toast.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2" />
			</Toast.Provider>
		</ToastContext.Provider>
	);
}

export function useToast() {
	return useContext(ToastContext);
}
