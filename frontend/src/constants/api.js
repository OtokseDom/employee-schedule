// version controlled API Endpoints
export const API = (version = "v1") => ({
	login: `/${version}/login`,
	signup: `/${version}/signup`,
	logout: `/${version}/logout`,
	user_auth: `/${version}/user-auth`,
	category: (id = "") => `/${version}/category${id ? `/${id}` : ""}`,
	user: (id = "") => `/${version}/user${id ? `/${id}` : ""}`,
	user_reports: (id = "", from = "", to = "") => `/${version}/user/${id}/reports?from=${from}&to=${to}`,
	task: (id = "") => `/${version}/task${id ? `/${id}` : ""}`,
	organization: (id = "") => `/${version}/organization${id ? `/${id}` : ""}`,
	organization_generate_code: (id) => `/${version}/organization/${id}/generate-code`,
	dashboard: (from = "", to = "", users = "") => `/${version}/dashboard?from=${from}&to=${to}&users=${users}`,
});
