import React from "react";
import useScrollToTop from "../hooks/ScrollToTop";
import SPGioHangList from "../products/SPGioHangList";


interface CartPageProps {}

const GioHangPage: React.FC<CartPageProps> = (props) => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

	return <SPGioHangList />;
};

export default GioHangPage;
