
import GioHangModel from "../model/GioHangModel";
import LoaiSanPhamModel from "../model/LoaiSanPhamModel";
import React from "react";
import { endpointBE } from "../utils/Enpoint";
import { request } from "./Request";

interface resultInterface {
   loaiSPList: LoaiSanPhamModel[];
   loaiSP: LoaiSanPhamModel;
}

async function getGenre(endpoint: string): Promise<resultInterface> {
   // Gọi phương thức request()
   const response = await request(endpoint);

   // Lấy ra danh sách quyển sách
   const loaiSPList: any = response._embedded.loaiSanPhams.map((genreData: any) => ({
      ...genreData,
   }))

   return { loaiSPList: loaiSPList, loaiSP: response.l};
}

export async function getAllGenres(): Promise<resultInterface> {
   const endpoint = endpointBE + "/loai-san-pham?sort=maLoaiSanPham";

   return getGenre(endpoint);
}

export async function get1Genre(maLoaiSanPham: number): Promise<resultInterface> {
   const endpoint = endpointBE + `/loai-san-pham/${maLoaiSanPham}`;
   const response = await request(endpoint);

   return { loaiSP: response, loaiSPList: response };
}

export async function getGenreByIdSanpham(maSanPham: number): Promise<resultInterface> {
   const endpoint = endpointBE + `/san-pham/${maSanPham}/danhSachLoaiSanPham`;

   return getGenre(endpoint);
}