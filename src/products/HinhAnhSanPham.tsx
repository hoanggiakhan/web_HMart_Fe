import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import HinhAnhModel from "../model/HinhAnhModel";
import { layToanBoAnh } from "../api/HinhAnhAPI";

  interface HinhAnhSanPham{
     maSanPham : number;
  }
const HinhAnhSanPham : React.FC<HinhAnhSanPham> = (props)=>{
    const maSanPham : number=props.maSanPham;
    const [danhSachHinhAnh,setDanhSachHinhAnh] = useState<HinhAnhModel[]>([]);
    const [dangTaiDuLieu,setDangTaiDuLieu] = useState(true);
    const [baoLoi,setBaoLoi] = useState(null);
    
    useEffect(()=>{
     layToanBoAnh(maSanPham).then(
         danhSach =>{
             setDanhSachHinhAnh(danhSach);
             setDangTaiDuLieu(false);
         }
     ).catch(
         error => {
            setDangTaiDuLieu(false);
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
    //     <div className="row">
    //     <div>
    //         {(hinhAnhDangChon) && <img src={hinhAnhDangChon.duLieuAnh} />}
    //     </div>
    //         <div className="row mt-2">
    //             {
    //                 danhSachHinhAnh.map((hinhAnh, index) => (
    //                     <div className={"col-3"} key={index}>
    //                         <img onClick={() => chonAnh(hinhAnh)} src={hinhAnh.duLieuAnh} style={{ width: '50px' }} />
    //                     </div>
    //                 ))
    //             }
    //         </div>
    // </div>


    <div className="row">
    <div className="col-12">
        <Carousel showArrows={true} showIndicators={true} >
            {
                danhSachHinhAnh.map((hinhAnh, index)=>(
                    <div key={index}>
                        <img src={hinhAnh.duLieuAnh} alt={`${hinhAnh.tenHinhAnh}`} style={{maxWidth:"250px"}} />
                    </div>
                ))
            }
        </Carousel>
    </div>
</div>
      );
}
export default HinhAnhSanPham;