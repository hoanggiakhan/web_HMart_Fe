import React, { useEffect, useState } from "react";
import { isToken } from "../utils/JwtService";
import { useCartItem } from "../utils/CartItemContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import SPGioHangProps from "./SPGioHangProps";
import { CheckoutPage } from "../pages/CheckoutPage";

interface SanPhamGioHangListProps {}

const SPGioHangList: React.FC<SanPhamGioHangListProps> = () => {
	const { setTongSP, gioHangList, setGioHangList } = useCartItem();
	const [totalPriceProduct, setTotalPriceProduct] = useState(0);

	useEffect(() => {
		const total = gioHangList.reduce((totalPrice, cartItem) => {
			return totalPrice + cartItem.soLuong * cartItem.sanPham.giaBan;
		}, 0);
		setTotalPriceProduct(total);
		setTongSP(gioHangList.length);
	}, [gioHangList, setTongSP]); // Khúc này đang bị overloading

	const navigation = useNavigate();
	// Xử lý xoá sách
	function handleRemovesanPham(maSanPham: number) {
		const newgioHangList = gioHangList.filter(
			(cartItem) => cartItem.sanPham.maSanPham !== maSanPham
		);
		localStorage.setItem("cart", JSON.stringify(newgioHangList));
		setGioHangList(newgioHangList);
		setTongSP(newgioHangList.length);
		toast.success("Xoá sản phẩm thành công");
	}

	// Thanh toán
	const [isCheckout, setIsCheckout] = useState(false);
    const xoaGioHang =()=>{
        setGioHangList([])
     }
     const renderGioHangRong = () => (
        <div className="bg-white container py-5">
            <div className="row justify-content-center align-items-center" style={{ minHeight: '500px' }}>
                <div className="col-md-8 text-center">
                    <h1 className="mb-4">Chưa có sản phẩm nào trong giỏ hàng</h1>
                    <img src="./../../images/public/12.png" className="img-fluid mb-4" alt="Empty Cart" />
                    <div>
                        <Link to={'/'} className="text-decoration-none">
                            <button className="btn btn-danger">Về trang chủ</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
    if (gioHangList.length===0) {
        return renderGioHangRong();
    
    }
	return (
		<>
			{!isCheckout ? (
				<div className="container mt-2 bg-light mb-5">
                <div className="row">
                    <div className="col-md-8">
                        {gioHangList.map((cartItem) => {
                                            return (
                                                <SPGioHangProps
                                                    cartItem={cartItem}
                                                    handleRemovesanPham={handleRemovesanPham}
                                                    key={cartItem.sanPham.maSanPham}
                                                />
                                            );
                                        })}
                        
                        <a href="#" className="d-block mt-2" type="button" onClick={xoaGioHang}>Xóa giỏ hàng</a>
                    </div>
                    <div className="col-md-4">
    
                        <div className=" p-3">
                            <p className="mb-2 d-flex justify-content-between"><span>Tạm tính giỏ hàng:</span> <span>{totalPriceProduct.toLocaleString()} ₫</span></p>
                            <p className="mb-2 d-flex justify-content-between"><span>Tạm tính sản phẩm KM:</span> <span>0 ₫</span></p>
                            <p className="mb-2 d-flex justify-content-between"><span>Tiết kiệm được:</span> <span>-0 ₫</span></p>
                            <p className="mb-2 d-flex justify-content-between"><span>Phí vận chuyển:</span> <span>{0} ₫</span></p>
                            <p className="mb-2 d-flex justify-content-between"><span>Khuyến mãi:</span> <span>0 ₫</span></p>
                            <p className="mb-2 d-flex justify-content-between font-weight-bold"><span>Thành tiền: {totalPriceProduct.toLocaleString()} đ</span> <span></span></p>
                            <small className="text-muted d-block mb-3">(Giá đã bao gồm VAT)</small>
                            <p className="text-danger text-center">{totalPriceProduct>=300000?'':`Mua thêm để miễn phí giao hàng từ 300.000₫`}</p>
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
                            <div className=" mt-4">
                                <label className="text-danger border-none">🎁 Ưu đãi đặc biệt cho bạn</label>
                            </div>
                        </div>
    
                    </div>
                </div>
    
            </div>
			) : (
				<CheckoutPage
					setIsCheckout={setIsCheckout}
					cartList={gioHangList}
					totalPriceProduct={totalPriceProduct}
				/>
                
			)}
		</>
	);
};

export default SPGioHangList;
