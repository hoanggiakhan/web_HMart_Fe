import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SanPhamModel from "../../model/SanPhamModel";
import dinhDangSo from "../utils/DinhDangSo";
import { laySanPhamTheoMaSanPham } from "../../api/SanPhamAPI";
import DanhSachGioHang from "./DanhSachGioHang";
import { key } from "localforage";
import { layToanBoAnh } from "../../api/HinhAnhAPI";
import HinhAnhModel from "../../model/HinhAnhModel";
import { useCartItem } from "../utils/GioHangContext";
import { toast } from "react-toastify";
import useScrollToTop from "../../hooks/ScrollToTop";
interface SanPhamPropsInterface {
    
}
const GioHang: React.FC<SanPhamPropsInterface> = (props) => {
    useScrollToTop();
    const { setTongGioHang, gioHang, setGioHang } = useCartItem();
	const [totalPriceProduct, setTotalPriceProduct] = useState(0);
 
	useEffect(() => {
		const total = gioHang.reduce((totalPrice, cartItem) => {
			return totalPrice + cartItem.soLuong * (cartItem.sanPham.giaBan !== undefined ? cartItem.sanPham.giaBan : 0) ;
		}, 0);
		setTotalPriceProduct(total);
		setTongGioHang(gioHang.length);
	}, [gioHang, setTongGioHang]); // Khúc này đang bị overloading
 const xoaGioHang =()=>{
    setGioHang([]);
 }
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
    
    const renderGioHangRong = () => (
        <div className="bg-light container py-5">
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
    if (gioHang.length===0) {
        return renderGioHangRong();

    }
    return (
        <div className="container mt-2 bg-light mb-5">
            <div className="row">
                <div className="col-md-8">
                    {gioHang.map((cartItem) => {
										return (
											<DanhSachGioHang
												gioHang={cartItem}
												handleRemoveBook={handleRemoveBook}
												key={cartItem.sanPham.maSanPham}
											/>
										);
									})}
                    
                    <hr />
                    <a href="#" className="d-block mt-2" type="button" onClick={xoaGioHang}>Xóa giỏ hàng</a>
                </div>
                <div className="col-md-4">

                    <div className=" p-3">
                        <p className="mb-2 d-flex justify-content-between"><span>Tạm tính giỏ hàng:</span> <span>{dinhDangSo(totalPriceProduct)} ₫</span></p>
                        <p className="mb-2 d-flex justify-content-between"><span>Tạm tính sản phẩm KM:</span> <span>0 ₫</span></p>
                        <p className="mb-2 d-flex justify-content-between"><span>Tiết kiệm được:</span> <span>-{dinhDangSo(0)} ₫</span></p>
                        <p className="mb-2 d-flex justify-content-between"><span>Phí vận chuyển:</span> <span>{dinhDangSo(0)} ₫</span></p>
                        <p className="mb-2 d-flex justify-content-between"><span>Khuyến mãi:</span> <span>0 ₫</span></p>
                        <p className="mb-2 d-flex justify-content-between font-weight-bold"><span>Thành tiền: {dinhDangSo(totalPriceProduct)} đ</span> <span></span></p>
                        <small className="text-muted d-block mb-3">(Giá đã bao gồm VAT)</small>
                        <p className="text-danger text-center">{totalPriceProduct>=300000?'':`Mua thêm để miễn phí giao hàng từ 300.000₫`}</p>
                        <Link className="btn btn-danger btn-block" to={'/thanh-toan'}>THANH TOÁN {dinhDangSo(totalPriceProduct)} ₫</Link>
                        <div className=" mt-4">
                            <label className="text-danger border-none">🎁 Ưu đãi đặc biệt cho bạn</label>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default GioHang;