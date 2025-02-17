"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z
	.object({
		// emailAddress: z.string().email(),
		// password: z.string().min(3),
		// passwordConfirm: z.string(),
		// accountType: z.enum(["personal", "company"]),
		// companyName: z.string().optional(),
		name: z.string(),
		shortName: z.string(),
		sku: z.string(),
		barcode: z.string(),
		highlight: z.string(),
		specification: z.string(),
		description: z.string(),
	})
	.refine(
		(data) => {
			return data.name !== "";
		},
		{
			message: "Product name is required",
			path: ["name"],
		}
	)
	.refine(
		(data) => {
			return data.shortName !== "";
		},
		{
			message: "Product short name is required",
			path: ["shortName"],
		}
	)
	.refine(
		(data) => {
			return data.sku !== "";
		},
		{
			message: "Product SKU is required",
			path: ["sku"],
		}
	);
// .refine(
// 	(data) => {
// 		if (data.accountType === "company") {
// 			return !!data.companyName;
// 		}
// 		return true;
// 	},
// 	{
// 		message: "Company name is required",
// 		path: ["companyName"],
// 	}
// )
// .refine(
// 	(data) => {
// 		return data.password === data.passwordConfirm;
// 	},
// 	{
// 		message: "Password do not match",
// 		path: ["passwordConfirm"],
// 	}
// );

export default function ProductForm() {
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			shortName: "",
			sku: "",
			barcode: "",
			highlight: "",
			specification: "",
			description: "",
		},
	});

	// const accountType = form.watch("accountType");

	const handleSubmit = (form) => {
		console.log({ ...form });
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
								<FormLabel>Product name</FormLabel>
								<FormControl>
									<Input placeholder="Product name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				{/* <FormField
					control={form.control}
					name="accountType"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Account type</FormLabel>
								<Select onValueChange={field.onChange}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select an account type" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="personal">Personal</SelectItem>
										<SelectItem value="company">Company</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				{accountType === "company" && (
					<FormField
						control={form.control}
						name="companyName"
						render={({ field }) => {
							return (
								<FormItem>
									<FormLabel>Company name</FormLabel>
									<FormControl>
										<Input placeholder="Company name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
				)} */}

				<FormField
					control={form.control}
					name="shortName"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Product short name</FormLabel>
								<FormControl>
									<Input placeholder="Product short name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="sku"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Product SKU</FormLabel>
								<FormControl>
									<Input placeholder="Product SKU" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="barcode"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Product barcode</FormLabel>
								<FormControl>
									<Input placeholder="Product barcode" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="highlight"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Product highlight</FormLabel>
								<FormControl>
									<Textarea placeholder="Product highlight" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<FormField
					control={form.control}
					name="specification"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel>Product specification</FormLabel>
								<FormControl>
									<Textarea placeholder="Product specification" {...field} />
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
								<FormLabel>Product description</FormLabel>
								<FormControl>
									<Textarea placeholder="Product description" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
