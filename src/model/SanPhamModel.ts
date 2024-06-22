class SanPhamModel{
   maSanPham : number; 
   tenSanPham ?: string;  // Có thể bị null 
    moTa : string;
    giaNiemYet ?: number;
    giaBan ?:number;
    soLuong ?: number;
    trungBinhXepHang ?: number;
    donViTinh ?: string;

    constructor(
        maSanPham : number, 
        tenSanPham : string,  // Có thể bị null 
         moTa : string,
         giaNiemYet : number,
         giaBan :number,
         soLuong : number,
         trungBinhXepHang : number,
         donViTinh : string
    ){
      this.maSanPham=maSanPham;
      this.tenSanPham=tenSanPham;
      this.moTa=moTa;
      this.giaNiemYet=giaNiemYet;
      this.giaBan=giaBan;
      this.soLuong=soLuong;
      this.trungBinhXepHang=trungBinhXepHang;
      this.donViTinh=donViTinh;
    }
}
export default SanPhamModel;