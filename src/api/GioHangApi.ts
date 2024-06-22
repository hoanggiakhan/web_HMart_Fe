import React from "react";
import GioHangModel from "../model/GioHangModel";
import { getIdUserByToken } from "../layouts/utils/JwtService";
import { request } from "./Request";
import { layToanBoSanPhamGioHang } from "./SanPhamAPI";


export async function getCartAllByIdUser(): Promise<GioHangModel[]> {
    const maNguoiDung = getIdUserByToken();
    const endpoint = `http://localhost:8080/nguoi-dung/${maNguoiDung}/danhSachGioHang`;
    try {
       const cartResponse = await request(endpoint);
 
       if (cartResponse) {
          const cartsResponseList: GioHangModel[] = await Promise.all(cartResponse._embedded.gioHangs.map(async (item: any) => {
             const productResponse = await layToanBoSanPhamGioHang(item.maGioHang);
             return { ...item, sanPham: productResponse };
          }));
          return cartsResponseList;
       }
    } catch (error) {
       console.error('Error: ', error);
    }
    return [];
 }