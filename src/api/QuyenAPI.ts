
import QuyenModel from "../model/QuyenModel";
import { endpointBE } from "../utils/Enpoint";
import { request, requestAdmin } from "./Request";

export async function getAllRoles(): Promise<QuyenModel[]> {
   const endpoint = endpointBE + "/quyen";
   // Gọi phương thức request()
   const response = await requestAdmin(endpoint);

   const rolesList: QuyenModel[] = response._embedded.quyens.map((role: any) => ({
      ...role,
   }));

   return rolesList;
}

export async function getRoleByIdUser(maNguoiDung: any): Promise<QuyenModel> {
   const endpoint = endpointBE + `/nguoi-dung/${maNguoiDung}/danhSachQuyen`;
   // Gọi phương thức request()
   const response = await request(endpoint);

   const rolesList: QuyenModel[] = response._embedded.quyens.map((role: any) => ({
      ...role,
   }));

   return rolesList[0];
}