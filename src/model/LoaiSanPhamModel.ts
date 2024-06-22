 import React from "react";
 class LoaiSanPhamModel{
    id ?: number;
    maLoaiSanPham : number;
    tenLoaiSanPham: string;
    constructor(maLoaiSanPham: number, tenLoaiSanPham: string) {
        this.maLoaiSanPham = maLoaiSanPham;
        this.tenLoaiSanPham = tenLoaiSanPham;
     }
}
export default LoaiSanPhamModel;