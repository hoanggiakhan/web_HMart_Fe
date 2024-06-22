import React, { useEffect, useState } from "react";
import SanPhamModel from "../../model/SanPhamModel";
import dinhDangSo from "../utils/DinhDangSo";

interface GioHangProps {
    gioHang: SanPhamModel[];
}

const ThanhToan: React.FC<GioHangProps> = (props) => {
    const [tongTien, setTongTien] = useState<number>(0);

    const tinhTongTien = () => {
        let tt = 0;
        props.gioHang.forEach((sp) => {
            tt += (sp.giaBan !== undefined ? sp.giaBan : 0) * (sp.soLuong || 0);
        });
        setTongTien(tt);
    };

    useEffect(() => {
        tinhTongTien();
    }, [props.gioHang]);

    var tienVanChuyen = 15000;
    if (tongTien >= 300000) {
        tienVanChuyen = 0;
    }

    const handlePayment = async () => {
        try {
            const response = await fetch(`http://localhost:8080/vnpay/create-payment?amount=${tongTien+tienVanChuyen}` ,
                {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const paymentUrl = await response.text();
            window.location.replace(paymentUrl);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container mt-3 mb-3 bg-light p-4 rounded">
            <div className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">Thông tin đặt hàng</h5>
                    <div className="form-group">
                        <label htmlFor="name">Họ tên người nhận<span className="text-danger">*</span></label>
                        <input type="text" className="form-control" id="name" placeholder="Nhập họ tên đầy đủ" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Số điện thoại<span className="text-danger">*</span></label>
                        <input type="text" className="form-control" id="phone" placeholder="Nhập số điện thoại" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="area">Khu vực giao hàng<span className="text-danger">*</span></label>
                        <div className="input-group">
                            <input type="text" className="form-control" id="area" placeholder="Nhập khu vực giao hàng" required />
                            <div className="input-group-append">
                                <button className="btn btn-danger" type="button">Đổi Khu Vực</button>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Địa chỉ<span className="text-danger">*</span></label>
                        <input type="text" className="form-control" id="address" placeholder="Nhập số nhà, tên đường" required />
                    </div>
                </div>
            </div>

            <div className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">Phương thức thanh toán</h5>
                    <div className="form-group">
                        <div className="custom-control custom-radio mb-2">
                            <input type="radio" id="cod" name="paymentMethod" className="custom-control-input" required />
                            <label className="custom-control-label" htmlFor="cod">
                                <img src="https://img.icons8.com/ios/50/000000/money.png" alt="COD" style={{ width: '20px' }} className="mr-2" />
                                Tiền mặt (COD)
                            </label>
                        </div>
                        <div className="custom-control custom-radio">
                            <input type="radio" id="online" name="paymentMethod" className="custom-control-input" required />
                            <label className="custom-control-label" htmlFor="online">
                                <img src={'./../../images/public/payment.jpg'} alt="Online Payment" style={{ width: '20px' }} className="mr-2" />
                                Thanh toán trực tuyến (Online)
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="notes">Ghi chú (Nếu có)</label>
                        <textarea className="form-control" id="notes" rows={3} placeholder="Nhập ghi chú"></textarea>
                    </div>
                </div>
            </div>

            <div className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">Tóm tắt đơn hàng</h5>
                    <div className="summary">
                        <p>Tổng tiền hàng <span className="float-right">{dinhDangSo(tongTien)} đ</span></p>
                        <p>Phí vận chuyển <span className="float-right">{dinhDangSo(tienVanChuyen)} đ</span></p>
                        <p>Khuyến mại <span className="float-right">0 đ</span></p>
                        <p className="font-weight-bold">Tổng thanh toán <span>{dinhDangSo(tongTien+tienVanChuyen)}</span> </p>
                    </div>
                    <div className="form-group mt-3">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="agreeTerms" required />
                            <label className="custom-control-label" htmlFor="agreeTerms">
                                Bằng việc chọn vào Đặt Hàng, bạn đồng ý với <a href="#" className="text-danger">Điều khoản và điều kiện giao dịch</a> trên Khanhmart.vn
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-danger btn-block mt-3" onClick={handlePayment}>XÁC NHẬN ĐẶT HÀNG</button>
                    <p className="text-muted mt-2">*Vui lòng điền thông tin nhận hàng</p>
                </div>
            </div>
        </div>
    );
}

export default ThanhToan;
