
import NguoiDungModel from "../model/NguoiDungModel";
import { endpointBE } from "../utils/Enpoint";
import { getRoleByIdUser } from "./QuyenAPI";
import { request, requestAdmin } from "./Request";

async function getUser(endpoint: string): Promise<NguoiDungModel> {
   // Gọi phương thức request()
   const response = await request(endpoint);

   return response;
}

export async function getAllUserRole(): Promise<NguoiDungModel[]> {
   const endpoint: string = endpointBE + `/quyen`;
   const response = await requestAdmin(endpoint);

   const data = response._embedded.quyens.map((roleData: any) => {
      // Duyệt qua mảng listUsers trong mỗi vai trò (role)
      const users = roleData._embedded.danhSachNguoiDungs.map((userData: any) => {
         // Xử lý các trường dữ liệu trong userData tại đây
         const user: NguoiDungModel = {
            maNguoiDung: userData.maNguoiDung,
            avatar: userData.avatar,
            ngaySinh: userData.ngaySinh,
            diaChiGiaoHang : userData.diaChiGiaoHang,
            email: userData.email,
            hoDem: userData.hoDem,
            ten: userData.ten,
            gioiTinh: userData.gioiTinh,
            soDienThoai: userData.soDienThoai,
            tenDangNhap: userData.tenDangNhap,
            quyen: roleData.tenQuyen,
         };
         return user;
      });
      return users;
   });

   return data;
}

export async function get1User(maNguoiDung: any): Promise<NguoiDungModel> {
   const endpoint = endpointBE + `/nguoi-dung/${maNguoiDung}`;
   const responseUser = await request(endpoint);
   const responseRole = await getRoleByIdUser(maNguoiDung);

   const user: NguoiDungModel = {
      maNguoiDung: responseUser.maNguoiDung,
      avatar: responseUser.avatar,
      ngaySinh: responseUser.ngaySinh,
      diaChiGiaoHang: responseUser.diaChiGiaoHang,
      email: responseUser.email,
      hoDem: responseUser.hoDem,
      ten: responseUser.ten,
     gioiTinh: responseUser.gender,
      soDienThoai: responseUser.soDienThoai,
      tenDangNhap: responseUser.tenDangNhap,
      quyen: responseRole.maQuyen,
   };

   return user;
}

export async function getUserByIdReview(idReview: number): Promise<NguoiDungModel> {
   // Xác định endpoint
   const endpoint: string = endpointBE + `/reviews/${idReview}/user`;

   return getUser(endpoint);
}