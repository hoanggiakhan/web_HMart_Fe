import React from "react";
import useScrollToTop from "../hooks/ScrollToTop";
import ProductCartList from "../products/ProductCartList";


interface CartPageProps {}

const CartPage: React.FC<CartPageProps> = (props) => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

	return <ProductCartList />;
};

export default CartPage;
