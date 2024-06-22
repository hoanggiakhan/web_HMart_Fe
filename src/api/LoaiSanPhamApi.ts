import React from "react";
import { request } from "./Request";
import LoaiSanPhamModel from "../model/LoaiSanPhamModel";

interface resultInterface {
    danhSachLoaiSanPham: LoaiSanPhamModel[];
    loaiSanPham: LoaiSanPhamModel;
 }
 
 async function layLoaiSanPham(endpoint: string): Promise<resultInterface> {
    // Gọi phương thức request()
    const response = await request(endpoint);
    // Lấy ra danh sách quyển sách
    const danhSachLoaiSanPham: any = response._embedded.loaiSanPhams.map((duLieuLoaiSanPham: any) => ({
       ...duLieuLoaiSanPham,
    }))
 
    return { danhSachLoaiSanPham: danhSachLoaiSanPham , loaiSanPham: response.loaiSanPham };
 }

 export async function layToanBoLoaiSanPham(): Promise<resultInterface> {
    const endpoint =   "http://localhost:8080/loai-san-pham?sort=maLoaiSanPham";
 
    return layLoaiSanPham(endpoint);
 }

 export async function layMotLoaiSanPham(maLoaiSanPham: number): Promise<resultInterface> {
    const endpoint = `http://localhost:8080/loai-san-pham/${maLoaiSanPham}`;
    const response = await request(endpoint);
 
    return { loaiSanPham: response, danhSachLoaiSanPham: response };
 }

 export async function layLoaiSanPhamTheoMaSP(maSanPham: number): Promise<resultInterface> {
    const endpoint = `http://localhost:8080/san-pham/${maSanPham}/danhSachLoaiSanPham`;
 
    return layLoaiSanPham(endpoint);
 }