import React from "react";
import SanPhamModel from "../model/SanPhamModel";

import HinhAnhModel from "../model/HinhAnhModel";
import { request } from "./Request";

export async function layAnhCuaMotSanPham(duongDan:string):Promise<HinhAnhModel[]>{
  const ketQua : HinhAnhModel[] = [];
    // gọi phương thức request
  const response= await  request(duongDan);
    // lấy ra json sản phẩm
  const responseData = response._embedded.hinhAnhs;
  for(const key in responseData){
     ketQua.push({
      maHinhAnh : responseData[key].maHinhAnh,
      tenHinhAnh :responseData[key].tenHinhAnh,
      laICon :responseData[key].laICon,
      duongDan :responseData[key].duongDan,
      duLieuAnh :responseData[key].duLieuAnh
      });
  }
  return ketQua;
}
export async function layToanBoAnh(maSanPham : number):Promise<HinhAnhModel[]>{
    // xác định endpoit
     const duongDan : string = `http://localhost:8080/san-pham/${maSanPham}/danhSachHinhAnh`;
     return layAnhCuaMotSanPham(duongDan);
}

export async function layMotAnh(maSanPham : number):Promise<HinhAnhModel[]>{
  // xác định endpoit
   const duongDan : string = `http://localhost:8080/san-pham/${maSanPham}/danhSachHinhAnh?sort=maHinhAnh,asc&page=0&size=1`;
   return layAnhCuaMotSanPham(duongDan);
}