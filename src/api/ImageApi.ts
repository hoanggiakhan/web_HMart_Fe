import React from "react";
import { request } from "./Request";
import ImageModel from "../model/ImageModel";

export async function getProductImage(url:string):Promise<ImageModel[]>{
  const ketQua : ImageModel[] = [];
    // gọi phương thức request
  const response= await  request(url);
    // lấy ra json sản phẩm
  const responseData = response._embedded.images;
  for(const key in responseData){
     ketQua.push({
      idImage : responseData[key].idImage,
      nameImage :responseData[key].nameImage,
      isIcon :responseData[key].isIcon,
      urlImage :responseData[key].urlImage,
      dataImage:responseData[key].dataImage,
      });
  }
  return ketQua;
}

export async function getOneImage(idProduct : number):Promise<ImageModel[]>{
    // xác định endpoit
     const url : string = `http://localhost:8080/products/${idProduct}/listImages?sort=idImage,asc&page=0&size=1`;
    
     return getProductImage(url);
  }
  export async function getAllImage(idProduct : number):Promise<ImageModel[]>{
    // xác định endpoit
     const url : string = `http://localhost:8080/products/${idProduct}/listImages`;
     return getProductImage(url);
}

