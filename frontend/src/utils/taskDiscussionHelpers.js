// utils/taskDiscussionHelpers.js
import axiosClient from "@/axios.client";
import { API } from "@/constants/api";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { useToast } from "@/contexts/ToastContextProvider";

export const fetchTaskDiscussions = async () => {
	const res = await axiosClient.get(API().task_discussion());
	return res?.data?.data || [];
};

export const storeTaskDiscussion = async (payload, setLoading, showToast) => {
	setLoading(true);
	try {
		const formData = new FormData();
		formData.append("content", payload.content);
		formData.append("task_id", payload.task_id);
		if (payload.parent_id) formData.append("parent_id", payload.parent_id);
		if (payload.attachments || []) {
			payload.attachments.forEach((file) => formData.append("attachments[]", file));
		}
		const res = await axiosClient.post(API().task_discussion(), formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return res?.data?.data;
	} catch (e) {
		showToast("Failed!", e.response?.data?.message, 3000, "fail");
		console.error("Error fetching data:", e);
	} finally {
		setLoading(false);
	}
};

export const updateTaskDiscussion = async (id, payload, setLoading, showToast) => {
	setLoading(true);
	try {
		const formData = new FormData();
		if (payload.content) formData.append("content", payload.content);
		if (payload.attachments?.length) {
			payload.attachments.forEach((file) => formData.append("attachments[]", file));
		}
		const res = await axiosClient.post(API().task_discussion(id), formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return res?.data?.data;
	} catch (e) {
		showToast("Failed!", e.response?.data?.message, 3000, "fail");
		console.error("Error fetching data:", e);
	} finally {
		setLoading(false);
	}
};

export const deleteTaskDiscussion = async (id, setLoading, showToast) => {
	setLoading(true);
	try {
		const res = await axiosClient.delete(API().task_discussion(id));
		return res?.data;
	} catch (e) {
		showToast("Failed!", e.response?.data?.message, 3000, "fail");
		console.error("Error fetching data:", e);
	} finally {
		setLoading(false);
	}
};
