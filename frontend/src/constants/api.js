// version controlled API Endpoints
export const API = (version = "v1") => ({
	login: `/${version}/login`,
	signup: `/${version}/signup`,
	logout: `/${version}/logout`,
	user_auth: `/${version}/user-auth`,
	task_status: (id = "") => `/${version}/task-status${id ? `/${id}` : ""}`,
	project: (id = "") => `/${version}/project${id ? `/${id}` : ""}`,
	category: (id = "") => `/${version}/category${id ? `/${id}` : ""}`,
	user: (id = "") => `/${version}/user${id ? `/${id}` : ""}`,
	user_reports: (id = "", from = "", to = "", projects = "") => `/${version}/user/${id}/reports?from=${from}&to=${to}&projects=${projects}`,
	task: (id = "") => `/${version}/task${id ? `/${id}` : ""}`,
	organization: (id = "") => `/${version}/organization${id ? `/${id}` : ""}`,
	organization_generate_code: (id) => `/${version}/organization/${id}/generate-code`,
	dashboard: (from = "", to = "", users = "", projects = "") => `/${version}/dashboard?from=${from}&to=${to}&users=${users}&projects=${projects}`,
});
