import axiosClient from "@/axios.client";
// import { columns } from "../components/ui/columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import { columns } from "./columns";

export default function Products() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchData();
		// if (alert.session !== 0) {
		// 	showAlert();
		// }
	}, []);
	const fetchData = () => {
		setLoading(true);
		axiosClient
			.get("/product-units")
			.then(({ data }) => {
				setProducts(data.product_units);
				// setMeta(data.meta);
				setLoading(false);
			})
			.catch((e) => {
				console.log(e);
				setLoading(false);
			});
	};
	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col ml-4 md:ml-0">
				<h1 className=" font-extrabold text-3xl">Products</h1>
				<p>List of all products</p>
			</div>
			<div className="w-screen md:w-full bg-card text-card-foreground border border-border rounded-md container p-10">
				<DataTable columns={columns} data={products} loading={loading} />
			</div>
		</div>
	);
}
