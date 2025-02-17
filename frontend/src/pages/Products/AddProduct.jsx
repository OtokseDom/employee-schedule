import ProductForm from "./ProductForm";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function AddProduct() {
	return (
		<div className="flex flex-col gap-4 w-screen md:w-1/2">
			<div className="flex items-center gap-4">
				<Link to="/products">
					<ChevronLeft size={30} />
				</Link>{" "}
				<div className="flex flex-col">
					<h1 className=" font-extrabold text-3xl">Add Product</h1>
					<p>Add new product</p>
				</div>
			</div>
			<div className="flex flex-col justify-center items-center  border border-border rounded-md container p-10">
				<ProductForm />
			</div>
		</div>
	);
}
