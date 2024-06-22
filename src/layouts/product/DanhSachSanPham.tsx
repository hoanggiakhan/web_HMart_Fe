import React, { useEffect, useState } from "react";
import SanPhamModel from "../../model/SanPhamModel";
import SanPhamProps from "./components/SanPhamProps";
import { layToanBoSanPham, timKiemSanPham } from "../../api/SanPhamAPI";
import { error } from "console";
import { PhanTrang } from "../utils/PhanTrang";

interface DanhSachSanPhamProps{
  tuKhoaTimKiem: string;
  maLoaiSanPham : number;
 
}
function DanhSachSanPham ({tuKhoaTimKiem,maLoaiSanPham} : DanhSachSanPhamProps){
   const [danhSachSanPham,setDanhSachSanPham] = useState<SanPhamModel[]>([]);
   const [dangTaiDuLieu,setDangTaiDuLieu] = useState(true);
   const [baoLoi,setBaoLoi] = useState(null);
   const [trangHienTai,setTrangHienTai]=useState(1);
   const[tongSoTrang,setTongSoTrang]=useState(0);
  
   useEffect(()=>{
    if(tuKhoaTimKiem==='' && maLoaiSanPham===0){
    layToanBoSanPham(trangHienTai-1).then(
        kq =>{
            setDanhSachSanPham(kq.ketQua);
            setTongSoTrang(kq.tongSoTrang);
            setDangTaiDuLieu(false)
        }
    ).catch(
        error => {
          setDangTaiDuLieu(false)
            setBaoLoi(error.message);
        }
    );
  }else{
    timKiemSanPham(tuKhoaTimKiem,maLoaiSanPham).then(
      kq =>{
          setDanhSachSanPham(kq.ketQua);
          setTongSoTrang(kq.tongSoTrang);
          setDangTaiDuLieu(false)
      }
  ).catch(
      error => {
        setDangTaiDuLieu(false)
          setBaoLoi(error.message);
      }
  );
  }
},[trangHienTai,tuKhoaTimKiem,maLoaiSanPham]);
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
const phanTrang=(trang:number)=>{
  setTrangHienTai(trang);
};

 if(danhSachSanPham.length===0){
  return(
    <div className="container mt-2">
      
       <div className="row mt-4 mb-3">
          <h1>Không có sản phẩm bạn tìm kiếm</h1>
       </div>
    </div>
      
  );
 }
  return(
    <div className="container mt-2">
      
       <div className="row mt-4 mb-3">
           {
            danhSachSanPham.map(sanPham=>(
             <SanPhamProps
                key={sanPham.maSanPham}
                sanPham={sanPham}
             />
            ))
           }
        
       </div>
       <PhanTrang
         trangHienTai={trangHienTai}
         tongSoTrang={tongSoTrang}
         phanTrang={phanTrang}
       />
    </div>
      
  );
}

export default DanhSachSanPham;