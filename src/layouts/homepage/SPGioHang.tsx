import React from "react";

import useScrollToTop from "../../hooks/ScrollToTop";
import SanPhamGioHang from "../product/SanPhamGioHangProps";
import DanhSachSPGioHang from "../product/DanhSachSPGioHang";


interface CartPageProps {}

const CartPage: React.FC<CartPageProps> = (props) => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

	return <DanhSachSPGioHang/>;
};

export default CartPage;