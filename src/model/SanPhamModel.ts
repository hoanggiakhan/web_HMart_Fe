import LoaiSanPhamModel from "./LoaiSanPhamModel";

class SanPhamModel {
   id?: any;
   maSanPham : number;
   tenSanPham ?: string; // Có thể NULL
   moTa?: string;
   giaNiemYet: number;
   giaBan: number;
   soLuong?: number;
   soLuongBan?: number;
   phanTramGiamGia?: number;
   duongDanAnh?: string;
   mangDuongDanAnh?: string[];
   danhSachMaLoai?: number[];
   danhSachLoai?: LoaiSanPhamModel[];
   donViTinh ?: string;

   constructor(maSanPham: number, tenSanPham: string, moTa: string, giaNiemYet : number, giaBan: number,
    soLuong?: number,
    soLuongBan?: number,
    phanTramGiamGia?: number,
    duongDan?: string,
    mangDuongDan?: string[],
    danhSachMaLoai?: number[],
    danhSachLoai?: LoaiSanPhamModel[],
    donViTinh ?: string) {
      this.maSanPham = maSanPham;
      this.tenSanPham = tenSanPham;
      this.moTa = moTa;
     this.giaNiemYet=giaNiemYet;
     this.giaBan=giaBan;
     this.soLuong=soLuong;
     this.soLuongBan=soLuongBan;
     this.phanTramGiamGia=phanTramGiamGia;
     this.duongDanAnh=duongDan;
     this.mangDuongDanAnh=mangDuongDan;
     this.danhSachLoai=danhSachLoai;
     this.danhSachMaLoai=danhSachMaLoai;
     this.donViTinh=donViTinh;
   }
}

export default SanPhamModel;