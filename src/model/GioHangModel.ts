import SanPhamModel from "./SanPhamModel";

class GioHangModel {
   maGioHang?: any;
   soLuong : number;
   sanPham: SanPhamModel;
   maNguoiDung?: number;

   constructor(soLuong: number, sanPham: SanPhamModel) {
      this.soLuong = soLuong;
      this.sanPham = sanPham;
   }
}

export default GioHangModel;