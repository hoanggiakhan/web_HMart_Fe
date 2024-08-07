import ProductTypeModel from "../model/ProductTypeModel";
import { endpointBE } from "../utils/Constant";
import { request } from "./Request";


interface resultInterface {
   productTypeList: ProductTypeModel[];
   productType: ProductTypeModel;
}

async function getProductType(endpoint: string): Promise<resultInterface> {
   // Gọi phương thức request()
   const response = await request(endpoint);

   // Lấy ra danh sách sản phẩm
   const productTypeList: any = response._embedded.productTypes.map((productTypeData: any) => ({
      ...productTypeData,
   }))
     
   return { productTypeList: productTypeList, productType: response.productType };
}

export async function getAllProductType(): Promise<resultInterface> {
   const endpoint = endpointBE + "/product-type?sort=idProductType";
   return getProductType(endpoint);

}



export async function getProductTypeByIdProduct(idProduct: number): Promise<resultInterface> {
   const endpoint = endpointBE + `/products/${idProduct}/listProductTypes`;

   return getProductType(endpoint);
}

export async function get1ProductType(idProductType: number): Promise<resultInterface> {
   const endpoint = endpointBE + `/product-type/${idProductType}`;
   const response = await request(endpoint);

   return { productType: response, productTypeList: response };
}