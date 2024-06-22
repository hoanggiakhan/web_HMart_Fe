import React, { useEffect, useState } from "react";
import SanPhamModel from "../../../model/SanPhamModel";
import HinhAnhModel from "../../../model/HinhAnhModel";
import { layToanBoAnh } from "../../../api/HinhAnhAPI";
import { Link } from "react-router-dom";
import dinhDangSo from "../../utils/DinhDangSo";
import { laySanPhamTheoMaSanPham, layToanBoSanPhamGioHang } from "../../../api/SanPhamAPI";
import { useCartItem } from "../../utils/GioHangContext";
import { getIdUserByToken, isToken } from "../../utils/JwtService";
import { toast } from "react-toastify";


  interface SanPhamPropsInterface{
     sanPham : SanPhamModel;
  }
const SanPhamProps : React.FC<SanPhamPropsInterface> = (props)=>{
    const maSanPham : number=props.sanPham.maSanPham;
    const [danhSachHinhAnh,setDanhSachHinhAnh] = useState<HinhAnhModel[]>([]);
    const [dangTaiDuLieu,setDangTaiDuLieu] = useState(true);
    const [sanPham,setSanPham] = useState<SanPhamModel|null>(null);
    const [baoLoi,setBaoLoi] = useState(null);
    const {setTongGioHang , gioHang } = useCartItem();
    const handleAddProduct = async (sanPhamMoi: SanPhamModel) => {
		// cái isExistBook này sẽ tham chiếu đến cái cart ở trên, nên khi update thì cart nó cũng update theo
		let isExistBook = gioHang.find(
			(cartItem) => cartItem.sanPham.maSanPham === sanPhamMoi.maSanPham
		);
		// Thêm 1 sản phẩm vào giỏ hàng
		if (isExistBook) {
			// nếu có rồi thì sẽ tăng số lượng
			isExistBook.soLuong += 1;

			// Lưu vào db
			if (isToken()) {
				const request = {
					idCart: isExistBook.maGioHang,
					quantity: isExistBook.soLuong,
				};
				const token = localStorage.getItem("token");
				fetch(`http://localhost:8080/gio-hangs/update-item`, {
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
							quantity: 1,
							book: sanPhamMoi,
							idUser: getIdUserByToken(),
						},
					];
					const token = localStorage.getItem("token");
					const response = await fetch(
						 "http://localhost:8080/gio-hangs/them-san-pham",
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
						const idCart = await response.json();
						gioHang.push({
							maGioHang: idCart,
							soLuong: 1,
							sanPham: sanPhamMoi,
						});
					}
				} catch (error) {
					console.log(error);
				}
			} else {
				gioHang.push({
					soLuong: 1,
					sanPham: sanPhamMoi,
				});
			}
		}
		// Lưu vào localStorage
		localStorage.setItem("cart", JSON.stringify(gioHang));
		// Thông báo toast
		toast.success("Thêm vào giỏ hàng thành công");
		setTongGioHang(gioHang.length);
	};
    useEffect(()=>{
     layToanBoAnh(maSanPham).then(
         hinhAnhData =>{
             setDanhSachHinhAnh(hinhAnhData);
             setDangTaiDuLieu(false)
         }
     ).catch(
         error => {
             setBaoLoi(error.message);
         }
     );
 },[]);
 useEffect(()=>{
    laySanPhamTheoMaSanPham(maSanPham).then(
        sanPham  =>{
            setSanPham(sanPham);
            setDangTaiDuLieu(false)
        }
    ).catch(
        error => {
            setBaoLoi(error.message);
        }
    );
},[]);
    if(dangTaiDuLieu){
     return(
       <div>
          <h1>Đang tải dữ liệu</h1>
       </div>
     );
    }
 
    if(baoLoi){
     return(
       <div>
          <h1>Gặp lỗi : {baoLoi}</h1>
       </div>
     );
    }
    let duLieuAnh:string ="";
    if(danhSachHinhAnh[0] && danhSachHinhAnh[0].duLieuAnh){
        duLieuAnh=danhSachHinhAnh[0].duLieuAnh;
    }
   
    
    const giaNiemYet = props.sanPham.giaNiemYet !== undefined ? props.sanPham.giaNiemYet : 0;
    const giaBan = props.sanPham.giaBan !== undefined ? props.sanPham.giaBan : 0;
    const phanTramGiamGia = giaNiemYet !== 0 ? ((giaNiemYet - giaBan) / giaNiemYet) * 100 : 0;
      return(
    <div className="col-md-3 mt-2" >
    <div className="card h-100">
        <Link to={`/san-pham/${props.sanPham.maSanPham}`}>
            <img
                src={duLieuAnh}
                className="card-img-top"
                alt={props.sanPham.tenSanPham}
                style={{ height: '300px', objectFit: 'cover'}}
            />
        </Link>
        
        <div className="card-body d-flex flex-column">
            {/* Label giảm giá */}
            <span className="badge bg-danger text-white position-absolute" style={{ top: '10px', left: '10px' }}>
            -{Math.round(phanTramGiamGia)}%
            </span>
            
            <Link to={`/san-pham/${props.sanPham.maSanPham}`} style={{textDecoration :'none'}}>
                <h6 className="card-title text-center text-dark">{props.sanPham.tenSanPham}</h6>
            </Link>
            
            <p className="card-text text-center">ĐVT: {props.sanPham.donViTinh}</p>
            
            <div className="price text-center mb-2">
            <span className="original-price text-end">
                    <del>{dinhDangSo(props.sanPham.giaNiemYet)} đ</del>
                </span>
                
                <span className="discounted-price text-danger">
                    <strong>{dinhDangSo(props.sanPham.giaBan)} đ</strong>
                </span>
            </div>
            
            <div className="mt-auto">
                <button className="btn btn-danger w-100" onClick={()=>handleAddProduct(props.sanPham)} >
                    <i className="fas fa-shopping-cart me-2"></i>
                    Thêm vào giỏ
                </button>
            </div>
        </div>
    </div>
</div>

      );
}
export default SanPhamProps;