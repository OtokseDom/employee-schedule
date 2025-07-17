// components/ErrorFallback.jsx
import React from "react";

export default function ErrorFallback({ error }) {
	return (
		<div className="p-4 text-center text-red-600">
			<h2 className="text-xl font-bold">Something went wrong 😢</h2>
			<pre className="mt-2 text-sm text-gray-600">{error.message}</pre>
		</div>
	);
}
