
import GioHangModel from "../model/GioHangModel";
import { endpointBE } from "../utils/Enpoint";
import { getIdUserByToken } from "../utils/JwtService";
import { request } from "./Request";
import { getProductByIdCartItem } from "./SanPhamApi";

export async function getCartAllByIdUser(): Promise<GioHangModel[]> {
   const maNguoiDung = getIdUserByToken();
   const endpoint = endpointBE + `/nguoi-dung/${maNguoiDung}/danhSachGioHang`;
   try {
      const cartResponse = await request(endpoint);

      if (cartResponse) {
         const cartsResponseList: GioHangModel[] = await Promise.all(cartResponse._embedded.gioHangs.map(async (item: any) => {
            const bookResponse = await getProductByIdCartItem(item.maGioHang);
            return { ...item, book: bookResponse };
         }));
         return cartsResponseList;
      }
   } catch (error) {
      console.error('Error: ', error);
   }
   return [];
}