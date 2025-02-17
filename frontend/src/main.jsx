import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./Router";
import { AuthContextProvider } from "./contexts/AuthContextProvider";
import { ThemeProvider } from "@material-tailwind/react";
import { SidebarContextProvider } from "./contexts/SidebarContextProvider";
import { ScrollContextProvider } from "./contexts/ScrollContextProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<AuthContextProvider>
			<SidebarContextProvider>
				<ScrollContextProvider>
					<ThemeProvider>
						<RouterProvider router={router} />
					</ThemeProvider>
				</ScrollContextProvider>
			</SidebarContextProvider>
		</AuthContextProvider>
	</React.StrictMode>
);
