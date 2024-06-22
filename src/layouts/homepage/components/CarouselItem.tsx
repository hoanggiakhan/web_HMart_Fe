import React, { useEffect, useState } from "react";
import SanPhamModel from "../../../model/SanPhamModel";
import HinhAnhModel from "../../../model/HinhAnhModel";
import { layMotAnh, layToanBoAnh } from "../../../api/HinhAnhAPI";


  interface CarouselItemInterface{
     sanPham : SanPhamModel;
  }
const CarouselItem : React.FC<CarouselItemInterface> = (props)=>{
    const maSanPham : number=props.sanPham.maSanPham;
    const [danhSachHinhAnh,setDanhSachHinhAnh] = useState<HinhAnhModel[]>([]);
    const [dangTaiDuLieu,setDangTaiDuLieu] = useState(true);
    const [baoLoi,setBaoLoi] = useState(null);
    useEffect(()=>{
     layMotAnh(maSanPham).then(
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
      return(
      
        <div className="row align-items-center">
            <div className="col-5 text-center">
                <img src={duLieuAnh} className="float-end" style={{ width: '150px' }} />
            </div>
            <div className="col-7">
                <h5>{props.sanPham.tenSanPham}</h5>
                <p>{props.sanPham.moTa}</p>
            </div>
        </div>
    );
}
export default CarouselItem;