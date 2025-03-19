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

const formSchema = z.object({
	name: z.string({
		required_error: "Name is required.",
	}),
	description: z.string({
		required_error: "Description is required.",
	}),
});

export default function EventForm({ data, setEvents, loading, setLoading, setIsOpenEvent, updateData, setUpdateData, fetchData }) {
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
		setLoading(true);
		try {
			if (Object.keys(updateData).length === 0) {
				console.log("add");
				const eventResponse = await axiosClient.post(`/event`, form);
				const addedEvent = eventResponse.data;
				// Insert added event in events array
				const updatedEvents = [addedEvent, ...data];
				setEvents(updatedEvents);
				showToast("Success!", "Event added.", 3000);
			} else {
				console.log("update");
				await axiosClient.put(`/event/${updateData?.id}`, form);
				fetchData();
				showToast("Success!", "Event updated.", 3000);
			}
		} catch (e) {
			showToast("Failed!", e.response?.data?.message, 3000);
			console.error("Error fetching data:", e);
		} finally {
			setUpdateData({});
			setLoading(false);
			setIsOpenEvent(false);
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
									<Input placeholder="Event name" {...field} />
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
