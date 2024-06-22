import React from "react";
import SanPhamModel from "../model/SanPhamModel";
import { request } from "./Request";



interface KetQuaInterface{
  ketQua : SanPhamModel[];
  tongSoTrang : number;
  tongSoSanPham : number;
}
async function laySanPham(duongDan : string) : Promise<KetQuaInterface>{
  const ketQua : SanPhamModel[] = [];
  
    // gọi phương thức request
  const response= await   request(duongDan);
    // lấy ra json sản phẩm
  const responseData = response._embedded.sanPhams;

  // lấy thông tin trang
  const tongSoTrang: number= response.page.totalPages;
  const tongSoSanPham: number=response.page.totalElements;
  for(const key in responseData){
     ketQua.push({
          maSanPham : responseData[key].maSanPham,
          tenSanPham : responseData[key].tenSanPham, 
           moTa : responseData[key].moTa,
           giaNiemYet : responseData[key].giaNiemYet,
           giaBan :responseData[key].giaBan,
           soLuong : responseData[key].soLuong,
           trungBinhXepHang : responseData[key].trungBinhXepHang,
           donViTinh : responseData[key].donViTinh
      });
  }
  return {ketQua : ketQua ,tongSoTrang : tongSoTrang,tongSoSanPham : tongSoSanPham};
}

export async function layToanBoSanPham(trang:number):Promise<KetQuaInterface>{
    const ketQua : SanPhamModel[]=[];
    // xác định endpoit
     const duongDan : string = `http://localhost:8080/san-pham?sort=maSanPham,desc&size=12&page=${trang}`;
    return  laySanPham(duongDan);
}
export async function layToanBoSanPhamGioHang(maGioHang : number):Promise<SanPhamModel | null>{
  const endpoint = `http://localhost:8080/gio-hang/${maGioHang}/san-pham`;

   try {
      // Gọi phương thức request()
      const response = await request(endpoint);

      // Kiểm tra xem dữ liệu endpoint trả về có dữ liệu không
      if (response) {

         // Trả về quyển sách
         return response;
      } else {
         throw new Error("Sản phẩm không tồn tại");
      }

   } catch (error) {
      console.error('Error: ', error);
      return null;
   }
}

export async function layBaSanPhamMoiNhat():Promise<KetQuaInterface>{
  const ketQua : SanPhamModel[] = [];
  // xác định endpoit
   const duongDan : string = 'http://localhost:8080/san-pham?sort=maSanPham,desc&page=0&size=3';
  return  laySanPham(duongDan);
}

export async function timKiemSanPham(tuKhoaTimKiem: string,maLoaiSanPham:number):Promise<KetQuaInterface>{
   let duongDan:string =`http://localhost:8080/san-pham?sort=maSanPham,desc&size=12&page=0`;
   if(tuKhoaTimKiem !=='' && maLoaiSanPham==0){
    duongDan=`http://localhost:8080/san-pham/search/findByTenSanPhamContaining?sort=maSanPham,desc&size=12&page=0&tenSanPham=${tuKhoaTimKiem}`;
   }else if(tuKhoaTimKiem ==='' && maLoaiSanPham>0){
    duongDan=`http://localhost:8080/san-pham/search/findByDanhSachLoaiSanPham_MaLoaiSanPham?sort=maSanPham,desc&size=12&page=0&maLoaiSanPham=${maLoaiSanPham}`;
   }else if(tuKhoaTimKiem !=='' && maLoaiSanPham>0){
    duongDan=`http://localhost:8080/san-pham/search/findByTenSanPhamContainingAndDanhSachLoaiSanPham_MaLoaiSanPham?sort=maSanPham,desc&size=12&page=0&maLoaiSanPham=${maLoaiSanPham}&tenSanPham=${tuKhoaTimKiem}`;
   }

  return laySanPham(duongDan);
}
export async function sanPhamLienQuan(maLoaiSanPham:number):Promise<KetQuaInterface>{
  let duongDan:string =`http://localhost:8080/san-pham?sort=maSanPham,desc&size=12&page=0`;
 
  if( maLoaiSanPham>0){
   duongDan=`http://localhost:8080/san-pham/search/findByDanhSachLoaiSanPham_MaLoaiSanPham?sort=maSanPham,desc&size=12&page=0&maLoaiSanPham=${maLoaiSanPham}`;
  }
 return laySanPham(duongDan);
}
export async function laySanPhamTheoMaSanPham(maSanPham : number):Promise<SanPhamModel|null>{
  let ketQua : SanPhamModel;
  // xác định endpoit
   const duongDan : string = `http://localhost:8080/san-pham/${maSanPham}`;
    // gọi phương thức request
    try{
   const response= await  fetch(duongDan);
   if(!response.ok){
    throw new Error('Gặp lỗi trong quá trình gọi API')
  }
    const sanPhamDaTa =await response.json();
  if(sanPhamDaTa){
    return {
      maSanPham : sanPhamDaTa.maSanPham,
      tenSanPham : sanPhamDaTa.tenSanPham, 
      moTa : sanPhamDaTa.moTa,
      giaNiemYet : sanPhamDaTa.giaNiemYet,
      giaBan :sanPhamDaTa.giaBan,
      soLuong : sanPhamDaTa.soLuong,
      trungBinhXepHang : sanPhamDaTa.trungBinhXepHang,
      donViTinh : sanPhamDaTa.donViTinh
    }
  }else{
    throw new Error('Sản phẩm không tồn tại');
  }
  }catch(error){
    console.error(error);
    return null;
}
}