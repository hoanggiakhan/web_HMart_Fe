import React, { useEffect, useState } from "react";
import SanPhamModel from "../../model/SanPhamModel";
import HinhAnhModel from "../../model/HinhAnhModel";
import dinhDangSo from "../utils/DinhDangSo";
import { layMotAnh, layToanBoAnh } from "../../api/HinhAnhAPI";
import GioHang from "./GioHang";
import { useCartItem } from "../utils/GioHangContext";
import GioHangModel from "../../model/GioHangModel";
import { isToken } from "../utils/JwtService";
import { toast } from "react-toastify";
import { confirm, useConfirm } from "material-ui-confirm";
import { Skeleton } from "@mui/material";
interface SanPhamPropsInterface{
    gioHang: GioHangModel;
	handleRemoveBook: any;
 }
const DanhSachGioHang: React.FC<SanPhamPropsInterface> =(props)=>{
    
     const {gioHang,setGioHang} = useCartItem();
    const [danhSachHinhAnh,setDanhSachHinhAnh] = useState<HinhAnhModel[]>([]);
    const [dangTaiDuLieu,setDangTaiDuLieu] = useState(true);
    const [baoLoi,setBaoLoi] = useState(null);
    
    const xoaSanPham =(sanPham : SanPhamModel)=>{
      const arr= gioHang.filter((sp)=>sp.sanPham.maSanPham!==sanPham.maSanPham);
      setGioHang([...arr]);
    }
    const [soLuong,setSoLuong] = useState(props.gioHang.sanPham.soLuong !== undefined
        ? props.gioHang.soLuong > props.gioHang.sanPham.soLuong
            ? props.gioHang.sanPham.soLuong
            : props.gioHang.soLuong
        : props.gioHang.soLuong);
    
        function handleConfirm() {
            confirm({
                title : "Xoá sản phẩm",
                description: "Bạn muốn bỏ sản phẩm này khỏi giỏ hàng không",
                confirmationText: "Xoá",
                cancellationText: "Huỷ",
            })
                .then(() => {
                    props.handleRemoveBook(props.gioHang.sanPham.maSanPham);
                    if (isToken()) {
                        const token = localStorage.getItem("token");
                        fetch(`http://localhost:8080/gio-hang/${props.gioHang.maGioHang}`, {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "content-type": "application/json",
                            },
                        }).catch((err) => console.log(err));
                    }
                })
                .catch(() => {});
        }
    
        // Lấy ảnh ra từ BE
        useEffect(() => {
            layMotAnh(props.gioHang.sanPham.maSanPham)
                .then((response) => {
                    setDanhSachHinhAnh(response);
                    setDangTaiDuLieu(false);
                })
                .catch((error) => {
                    setDangTaiDuLieu(false);
                    setBaoLoi(error.message);
                });
        }, [props.gioHang.sanPham.maSanPham]);
    
        // Loading ảnh thumbnail
        let duLieuAnh:string ="";
        if(danhSachHinhAnh[0] && danhSachHinhAnh[0].duLieuAnh){
            duLieuAnh=danhSachHinhAnh[0].duLieuAnh;
        }
        // Xử lý tăng số lượng
        const add = () => {
            if (soLuong) {
                if (
                    soLuong <
                    (props.gioHang.sanPham.soLuong ? props.gioHang.sanPham.soLuong : 1)
                ) {
                    setSoLuong(soLuong + 1);
                    handleModifiedsoLuong(props.gioHang.sanPham.maSanPham, 1);
                } else {
                    toast.warning("Số lượng tồn kho không đủ");
                }
            }
        };
    
        // Xử lý giảm số lượng
        const reduce = () => {
            if (soLuong) {
                // Nếu số lượng về không thì xoá sản phẩm đó
                if (soLuong - 1 === 0) {
                    handleConfirm();
                } else if (soLuong > 1) {
                    setSoLuong(soLuong - 1);
                    handleModifiedsoLuong(props.gioHang.sanPham.maSanPham, -1);
                }
            }
        };
    
        // Xử lý cập nhật lại soLuong trong localstorage / database
        function handleModifiedsoLuong(maSanPham: number, soLuong: number) {
            const cartData: string | null = localStorage.getItem("cart");
            const cart: GioHangModel[] = cartData ? JSON.parse(cartData) : [];
            // cái isExistBook này sẽ tham chiếu đến cái cart ở trên, nên khi update thì cart nó cũng update theo
            let isExistBook = cart.find(
                (gioHang) => gioHang.sanPham.maSanPham === maSanPham
            );
            // Thêm 1 sản phẩm vào giỏ hàng
            if (isExistBook) {
                // nếu có rồi thì sẽ tăng số lượng
                isExistBook.soLuong += soLuong;
    
                // Cập nhật trong db
                if (isToken()) {
                    const token = localStorage.getItem("token");
                    fetch(`http://localhost:8080/gio-hang/update-item`, {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "content-type": "application/json",
                        },
                        body: JSON.stringify({
                            idCart: props.gioHang.maGioHang,
                            soLuong: isExistBook.soLuong,
                        }),
                    }).catch((err) => console.log(err));
                }
            }
            // Cập nhật lại
            localStorage.setItem("cart", JSON.stringify(cart));
            setGioHang(cart);
        }
    
        if (dangTaiDuLieu) {
            return (
                <>
                    <Skeleton className='my-3' variant='rectangular' />
                </>
            );
        }
    
        if (baoLoi) {
            return (
                <>
                    <h4>Lỗi ...</h4>
                </>
            );
        }
    
    return(
        <div className="d-flex justify-content-between align-items-center">
    <div className="d-flex align-items-center" style={{ width: '30%' }}>
        <img src={duLieuAnh} alt="Product" className="img-fluid mr-3" style={{ width: '50px', height: '50px' }} />
        <div>
            <p className="mb-1">{props.gioHang.sanPham.tenSanPham}</p>
            <small>ĐVT: {props.gioHang.sanPham.donViTinh}</small>
        </div>
    </div>
    <div className="d-flex flex-column align-items-end" style={{ width: '20%' }}>
        <span className="text-danger mr-2">
            <del>{dinhDangSo(props.gioHang.sanPham.giaNiemYet)} ₫</del>
        </span>
        <span className="d-block">{dinhDangSo(props.gioHang.sanPham.giaBan)} ₫</span>
    </div>
    <div className="d-flex align-items-center" style={{ width: '20%' }}>
        <div className="d-flex align-items-center border border-danger p-2 btn btn-sm p-2" style={{ maxWidth: '150px', maxHeight: '40px' }}>
            <button className="btn btn-sm text-danger" type="button" onClick={reduce}>-</button>
            <span className="text-danger mx-2">{soLuong}</span>
            <button className="btn btn-sm text-danger" type="button" onClick={add}>+</button>
        </div>
    </div>
    <div style={{ width: '10%' }}>
        <button className="btn btn-outline-danger btn-sm ml-3" onClick={() => xoaSanPham(props.gioHang.sanPham)}>X</button>
    </div>
</div>

    
    );
}
export default DanhSachGioHang;