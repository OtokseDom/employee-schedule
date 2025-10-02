// utils/taskDiscussionHelpers.js
import axiosClient from "@/axios.client";
import { API } from "@/constants/api";

export const fetchTaskDiscussions = async () => {
	const res = await axiosClient.get(API().task_discussion());
	return res?.data?.data || [];
};

export const storeTaskDiscussion = async (payload) => {
	const formData = new FormData();
	formData.append("content", payload.content);
	formData.append("task_id", payload.task_id);
	if (payload.parent_id) formData.append("parent_id", payload.parent_id);
	if (payload.attachments?.length) {
		payload.attachments.forEach((file) => formData.append("attachments[]", file));
	}
	const res = await axiosClient.post(API().task_discussion(), formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	return res?.data?.data;
};

export const updateTaskDiscussion = async (id, payload) => {
	const formData = new FormData();
	if (payload.content) formData.append("content", payload.content);
	if (payload.attachments?.length) {
		payload.attachments.forEach((file) => formData.append("attachments[]", file));
	}
	const res = await axiosClient.post(API(id), formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	return res?.data?.data;
};

export const deleteTaskDiscussion = async (id) => {
	const res = await axiosClient.delete(API(id));
	return res?.data;
};
