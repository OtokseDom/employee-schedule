import axios from "axios";

const axiosClient = axios.create({
	// where port is running via .env
	baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

// interceptors executed before request is sent or after response is received
// Request Interceptor
// Checks if the user is authorized before proceeding
axiosClient.interceptors.request.use((config) => {
	const token = localStorage.getItem("ACCESS_TOKEN");
	config.headers.Authorization = `Bearer ${token}`;
	return config;
});

// Response Inteceptor
// 2 params: when resolved or when rejected
axiosClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		const { response } = error;
		if (response?.status === 401) {
			// if user is unauthorize, token invalid, token expired
			localStorage.removeItem("ACCESS_TOKEN");
		}
		// else {
		//     // other handle
		// }
		return Promise.reject(error);

		// throw error;
	}
);

export default axiosClient;
