/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import { IconButton } from "@mui/material";
import SanPhamModel from "../model/SanPhamModel";
import { useCartItem } from "../utils/CartItemContext";
import { getIdUserByToken, isToken } from "../utils/JwtService";
import { endpointBE } from "../utils/Enpoint";
import TextEllipsis from "./componets/text-ellipsis/TextEllipsis";
import { layToanBoAnh } from "../api/HinhAnhAPI";
import HinhAnhModel from "../model/HinhAnhModel";

interface SanPhamProps {
    sanPham: SanPhamModel;
}

const SanPhamProps: React.FC<SanPhamProps> = ({ sanPham }) => {
    const { setTongSP, gioHangList } = useCartItem();
    const navigation = useNavigate();
    // Xử lý thêm sản phẩm vào giỏ hàng
    const handleAddProduct = async (sanPhamMoi: SanPhamModel) => {
        // cái isExistBook này sẽ tham chiếu đến cái cart ở trên, nên khi update thì cart nó cũng update theo
        let isExistProduct = gioHangList.find(
            (cartItem) => cartItem.sanPham.maSanPham === sanPhamMoi.maSanPham
        );
        // Thêm 1 sản phẩm vào giỏ hàng
        if (isExistProduct) {
            // nếu có rồi thì sẽ tăng số lượng
            isExistProduct.soLuong += 1;

            // Lưu vào db
            if (isToken()) {
                const request = {
                    maLoaiSanPham: isExistProduct.maGioHang,
                    soLuong: isExistProduct.soLuong,
                };
                const token = localStorage.getItem("token");
                fetch(endpointBE + `/gio-hangs/update-item`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(request),
                }).catch((err) => console.log(err));
            }
        } else {
            // Lưu vào db
            if (isToken()) {
                try {
                    const request = [
                        {
                            soLuong: 1,
                            sanPham: sanPhamMoi,
                            maNguoiDung: getIdUserByToken(),
                        },
                    ];
                    const token = localStorage.getItem("token");
                    const response = await fetch(
                        endpointBE + "/gio-hangs/them-san-pham",
                        {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "content-type": "application/json",
                            },
                            body: JSON.stringify(request),
                        }
                    );

                    if (response.ok) {
                        const maGioHang = await response.json();
                        gioHangList.push({
                            maGioHang: maGioHang,
                            soLuong: 1,
                            sanPham: sanPhamMoi,
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                gioHangList.push({
                    soLuong: 1,
                    sanPham: sanPhamMoi,
                });
            }
        }
        // Lưu vào localStorage
        localStorage.setItem("cart", JSON.stringify(gioHangList));
        // Thông báo toast
        toast.success("Thêm vào giỏ hàng thành công");
        setTongSP(gioHangList.length);
    };
    const [danhSachHinhAnh, setDanhSachHinhAnh] = useState<HinhAnhModel[]>([]);
    const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
    const [baoLoi, setBaoLoi] = useState(null);

    // Xử lý chức năng yêu sách
    useEffect(() => {
        layToanBoAnh(sanPham.maSanPham).then(
            hinhAnhData => {
                setDanhSachHinhAnh(hinhAnhData);
                setDangTaiDuLieu(false)
            }
        ).catch(
            error => {
                setBaoLoi(error.message);
            }
        );
    }, []);
    if (dangTaiDuLieu) {
        return (
            <div>
                <h1>Đang tải dữ liệu</h1>
            </div>
        );
    }

    if (baoLoi) {
        return (
            <div>
                <h1>Gặp lỗi : {baoLoi}</h1>
            </div>
        );
    }
    let duLieuAnh: string = "";
    if (danhSachHinhAnh[0] && danhSachHinhAnh[0].duLieuAnh) {
        duLieuAnh = danhSachHinhAnh[0].duLieuAnh;
    }
    const giaNiemYet = sanPham.giaNiemYet !== undefined ? sanPham.giaNiemYet : 0;
    const giaBan = sanPham.giaBan !== undefined ? sanPham.giaBan : 0;
    const phanTramGiamGia = giaNiemYet !== 0 ? ((giaNiemYet - giaBan) / giaNiemYet) * 100 : 0;
    return (
        // <div className='col-md-6 col-lg-3 mt-3'>
        // 	<div className='card position-relative'>
        // 		{sanPham.phanTramGiamGia !== 0 && (
        // 			<h4
        // 				className='my-0 d-inline-block position-absolute end-0'
        // 				style={{ top: "15px" }}
        // 			>
        // 				{sanPham.soLuong === 0 ? (
        // 					<span className='badge bg-danger'>Hết hàng</span>
        // 				) : (
        // 					<span className='badge bg-primary'>
        // 						{sanPham.phanTramGiamGia}%
        // 					</span>
        // 				)}
        // 			</h4>
        // 		)}
        // 		<Link to={`/san-pham/${sanPham.maSanPham}`}>
        // 			<img
        // 				src={duLieuAnh}
        // 				className='card-img-top mt-3'
        // 				alt={sanPham.tenSanPham}
        // 				style={{ height: "300px" }}
        // 			/>
        // 		</Link>
        // 		<div className='card-body'>
        // 			<Link
        // 				to={`/san-pham/${sanPham.maSanPham}`}
        // 				style={{ textDecoration: "none" }}
        // 			>
        // 				<h5 className='card-title'>
        // 					<Tooltip title={sanPham.tenSanPham} arrow>
        // 						<span>
        // 							<TextEllipsis text={sanPham.tenSanPham + ""} limit={20} />
        // 						</span>
        // 					</Tooltip>
        // 				</h5>
        // 			</Link>
        // 			<div className='price mb-3 d-flex align-items-center justify-content-between'>
        // 				<div className='d-flex align-items-center'>
        // 					<span className='discounted-price text-danger'>
        // 						<strong style={{ fontSize: "22px" }}>
        // 							{sanPham.giaBan?.toLocaleString()}đ
        // 						</strong>
        // 					</span>
        // 					{sanPham.phanTramGiamGia !== 0 && (
        // 						<span className='original-price ms-3 small fw-bolder'>
        // 							<del>{sanPham.giaNiemYet?.toLocaleString()}đ</del>
        // 						</span>
        // 					)}
        // 				</div>
        // 				<span
        // 					className='ms-2'
        // 					style={{ fontSize: "12px", color: "#aaa" }}
        // 				>
        // 					Đã bán {sanPham.soLuongBan}
        // 				</span>
        // 			</div>
        // 			<div className='row mt-2' role='group'>
        // 				<div className='col-6'>
        // 					{sanPham.soLuong !== 0 && (
        // 						<Tooltip title='Thêm vào giỏ hàng'>
        // 							<button
        // 								className='btn btn-primary btn-block'
        // 								onClick={() => handleAddProduct(sanPham)}
        // 							>
        // 								<i className='fas fa-shopping-cart'></i>
        // 							</button>
        // 						</Tooltip>
        // 					)}
        // 				</div>
        // 			</div>
        // 		</div>
        // 	</div>
        // </div>


        <div className="col-md-3 mt-2" >
            <div className="card h-100">
                <Link to={`/san-pham/${sanPham.maSanPham}`}>
                    <img
                        src={duLieuAnh}
                        className="card-img-top"
                        alt={sanPham.tenSanPham}
                        style={{ height: '300px', objectFit: 'cover' }}
                    />
                </Link>

                <div className="card-body d-flex flex-column">
                    {/* Label giảm giá */}
                    <span className="badge bg-danger text-white position-absolute" style={{ top: '10px', left: '10px' }}>
                        -{Math.round(phanTramGiamGia)}%
                    </span>

                    <Link to={`/san-pham/${sanPham.maSanPham}`} style={{ textDecoration: 'none' }}>
                        <h6 className="card-title text-center text-dark">{sanPham.tenSanPham}</h6>
                    </Link>

                    <p className="card-text text-center">ĐVT: {sanPham.donViTinh}</p>

                    <div className="price text-center mb-2">
                        <span className="original-price text-end">
                            <del>{sanPham.giaNiemYet.toLocaleString()} đ</del>
                        </span>

                        <span className="discounted-price text-danger">
                            <strong>{sanPham.giaBan.toLocaleString()} đ</strong>
                        </span>
                    </div>

                    <div className="mt-auto">
                        {
                            sanPham.soLuong !== 0 && (
                                <Tooltip title='Thêm vào giỏ hàng'>
                                    <button className="btn btn-danger w-100" onClick={() => handleAddProduct(sanPham)} >
                                        <i className="fas fa-shopping-cart me-2"></i>
                                        Thêm vào giỏ
                                    </button>
                                </Tooltip>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SanPhamProps;
