// version controlled API
export const API = (version = "v1") => ({
	login: `/${version}/login`,
	logout: `/${version}/logout`,
	user: `/${version}/user`,
	tasks: `/${version}/task`,
	taskHistory: `/${version}/task-history`,
	dashboard: `/${version}/dashboard`,
});
