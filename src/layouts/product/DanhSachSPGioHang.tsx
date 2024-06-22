import React, { useEffect, useState } from "react";
import { useCartItem } from "../utils/GioHangContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import BookCartProps from "./SanPhamGioHangProps";
import { isToken } from "../utils/JwtService";
import SanPhamGioHang from "./SanPhamGioHangProps";


interface DanhSachSPGioHangProps {}

const DanhSachSPGioHang: React.FC<DanhSachSPGioHangProps> = () => {
	const { setTongGioHang, gioHang, setGioHang } = useCartItem();
	const [totalPriceProduct, setTotalPriceProduct] = useState(0);
 
	useEffect(() => {
		const total = gioHang.reduce((totalPrice, cartItem) => {
			return totalPrice + cartItem.soLuong * (cartItem.sanPham.giaBan !== undefined ? cartItem.sanPham.giaBan : 0) ;
		}, 0);
		setTotalPriceProduct(total);
		setTongGioHang(gioHang.length);
	}, [gioHang, setTongGioHang]); // Khúc này đang bị overloading

	const navigation = useNavigate();
	// Xử lý xoá sách
	function handleRemoveBook(maSanPham: number) {
		const newCartList = gioHang.filter(
			(cartItem) => cartItem.sanPham.maSanPham !== maSanPham
		);
		localStorage.setItem("cart", JSON.stringify(newCartList));
		setGioHang(newCartList);
		setTongGioHang(newCartList.length);
		toast.success("Xoá sản phẩm thành công");
	}

	// Thanh toán
	const [isCheckout, setIsCheckout] = useState(false);

	return (
		<>
			{!isCheckout ? (
				<div style={{ overflow: "hidden" }}>
					{gioHang.length === 0 && (
						<div className='d-flex align-items-center justify-content-center flex-column position-relative'>
							<img
								src='https://newnet.vn/themes/newnet/assets/img/empty-cart.png'
								alt=''
								width='63%'
							/>
							<Link
								to={"/search"}
								className='position-absolute'
								style={{ bottom: "100px" }}
							>
								<Button variant='contained'>Mua sắm ngay</Button>
							</Link>
						</div>
					)}
					<div
						className='row my-4 pb-5 px-5'
						style={
							gioHang.length === 0
								? { display: "none" }
								: { display: "flex" }
						}
					>
						{/* Bên trái */}
						<h2 className='mt-2 px-3 py-3 mb-0'>
							GIỎ HÀNG <span>({gioHang.length} sản phẩm)</span>
						</h2>
						<div className='col-lg-8 col-md-12 col-sm-12 '>
							<div className='container-book bg-light '>
								<div className='row px-4 py-3'>
									<div className='col'>Sản phẩm</div>
									<div className='col-3 text-center'>Số lượng</div>
									<div className='col-2 text-center'>Số tiền</div>
									<div className='col-2 text-center'>Thao tác</div>
								</div>
							</div>
							<div className='container-book bg-light mt-3 px-3'>
								<div className='row px-4 py-3'>
									{gioHang.map((cartItem) => {
										return (
											<SanPhamGioHang
												gioHang={cartItem}
												handleRemoveBook={handleRemoveBook}
												key={cartItem.sanPham.maSanPham}
											/>
										);
									})}
								</div>
							</div>
						</div>

						{/* Bên phải */}
						<div
							className='container-book bg-light col-lg col-md-12 col-sm-12 px-5 pb-4 mt-lg-0 mt-md-3 mt-sm-3'
							style={{ height: "fit-content" }}
						>
							<div className='d-flex align-items-center justify-content-between mt-3'>
								<span>Thành tiền:</span>
								<span>
									<strong>
										{totalPriceProduct.toLocaleString()} đ
									</strong>
								</span>
							</div>
							<hr className='my-2' />
							<div className='d-flex align-items-center justify-content-between'>
								<span>
									<strong>Tổng số tiền (gồm VAT):</strong>
								</span>
								<span className='text-danger fs-5'>
									<strong>
										{totalPriceProduct.toLocaleString()} đ
									</strong>
								</span>
							</div>

							<Button
								variant='contained'
								sx={{ width: "100%", marginTop: "30px" }}
								onClick={() => {
									if (isToken()) {
										setIsCheckout(true);
									} else {
										toast.warning(
											"Bạn cần đăng nhập để thực hiện chức năng này"
										);
										navigation("/login");
									}
								}}
							>
								Thanh toán
							</Button>
						</div>
					</div>
				</div>
			) : (
				// <CheckoutPage
				// 	setIsCheckout={setIsCheckout}
				// 	cartList={cartList}
				// 	totalPriceProduct={totalPriceProduct}
				// />
                <div>Đăng xuất</div>
			)}
		</>
	);
};

export default DanhSachSPGioHang;
