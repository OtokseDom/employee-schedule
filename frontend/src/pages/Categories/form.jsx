"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axiosClient from "@/axios.client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/contexts/ToastContextProvider";
import { useEffect } from "react";
import { useLoadContext } from "@/contexts/LoadContextProvider";
import { useAuthContext } from "@/contexts/AuthContextProvider";

const formSchema = z.object({
	name: z.string().refine((data) => data.trim() !== "", {
		message: "Name is required.",
	}),
	description: z.string().refine((data) => data.trim() !== "", {
		message: "Description is required.",
	}),
});

export default function CategoryForm({ data, setCategories, setIsOpen, updateData, setUpdateData, fetchData }) {
	const { user } = useAuthContext();
	const { loading, setLoading } = useLoadContext();
	const showToast = useToast();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
		},
	});

	useEffect(() => {
		if (updateData) {
			const { name, description } = updateData;
			form.reset({
				name,
				description,
			});
		}
	}, [updateData, form]);

	const handleSubmit = async (form) => {
		form.organization_id = user.data.organization_id;
		setLoading(true);
		try {
			if (Object.keys(updateData).length === 0) {
				const categoryResponse = await axiosClient.post(`/category`, form);
				const addedCategory = categoryResponse.data.data;
				// Insert added category in categories array
				const updatedCategories = [addedCategory, ...data];
				setCategories(updatedCategories);
				showToast("Success!", "Category added.", 3000);
			} else {
				await axiosClient.put(`/category/${updateData?.id}`, form);
				fetchData();
				showToast("Success!", "Category updated.", 3000);
			}
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 3000, "fail");
			console.error("Error fetching data:", e);
		} finally {
			setUpdateData({});
			setLoading(false);
			setIsOpen(false);
		}
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4 max-w-md w-full">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder="Category name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="description"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea placeholder="Description" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<Button type="submit" disabled={loading}>
					{loading && <Loader2 className="animate-spin mr-5 -ml-11 text-foreground" />} {Object.keys(updateData).length === 0 ? "Submit" : "Update"}
				</Button>
			</form>
		</Form>
	);
}
