// components/ErrorBoundary.jsx
import { Component } from "react";

export default class ErrorFallback extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, info) {
		console.error("Caught by ErrorBoundary:", error, info);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="p-4 text-center text-red-600">
					<h2 className="text-xl font-bold">Something went wrong 😢</h2>
					<pre className="mt-2 text-sm text-gray-600">{this.state.error.message}</pre>
				</div>
			);
		}

		return this.props.children;
	}
}
