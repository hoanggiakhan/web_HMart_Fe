import React from "react";
import Banner from "./components/Banner";
import Carousel from "./components/Carousel";

import DanhSachSanPham from "../product/DanhSachSanPham";
import { useParams } from "react-router-dom";
import SanPhamModel from "../../model/SanPhamModel";

interface HomePageProps{
    tuKhoaTimKiem : string;
   
}



function HomePage({tuKhoaTimKiem} : HomePageProps){
    const {maLoaiSanPham} = useParams();
    let maLoaiSanPhamNumber=0;
    try {
        maLoaiSanPhamNumber=parseInt(maLoaiSanPham+'');
    } catch (error) {
        maLoaiSanPhamNumber=0;
        console.log(error);
    }
    if(Number.isNaN(maLoaiSanPhamNumber)){
        maLoaiSanPhamNumber=0;
    }
    return(
     <div>
         <Banner/>
         <Carousel/>
         <DanhSachSanPham  tuKhoaTimKiem={tuKhoaTimKiem} maLoaiSanPham={maLoaiSanPhamNumber}/>
     </div>
    );
}
export default HomePage;