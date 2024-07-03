class NguoiDungModel {
    id?: any;
    maNguoiDung: number;
    ngaySinh: Date;
    diaChiGiaoHang: string;
    diaChiMuaHang?: string;
    email: string;
    hoDem: string;
    ten: string;
    gioiTinh: string;
    matKhau?: string;
    soDienThoai: string;
    tenDangNhap: string;
    avatar: string;
    quyen?: number;
 
    constructor(maNguoiDung: number,
       ngaySinh: Date,
       diaChiGiaoHang: string,
       diaChiMuaHang: string,
       email: string,
       hoDem: string,
       ten: string,
      gioiTinh: string,
       matKhau: string,
       soDienThoai: string,
       tenDangNhap: string, avatar: string) {
       this.maNguoiDung = maNguoiDung;
       this.ngaySinh = ngaySinh;
       this.diaChiGiaoHang = diaChiGiaoHang;
       this.diaChiMuaHang = diaChiMuaHang;
       this.email = email;
       this.hoDem = hoDem;
       this.ten = ten;
       this.gioiTinh =gioiTinh;
       this.matKhau = matKhau;
       this.soDienThoai = soDienThoai;
       this.tenDangNhap = tenDangNhap;
       this.avatar = avatar;
    }
 }
 
 export default NguoiDungModel;