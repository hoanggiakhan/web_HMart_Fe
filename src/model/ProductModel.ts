import ProductTypeModel from "./ProductTypeModel";


class ProductModel {
   id?: any;
   idProduct: number;
   nameProduct?: string; // Có thể NULL
   description?: string;
   listPrice: number;
   sellPrice: number;
   quantity?: number;
   soldQuantity?: number;
   discountPercent?: number;
  dataImage?: string;
   relatedImg?: string[];
   idProductType?: number[];
   producttypesList?: ProductTypeModel[];
   unit ?: string;
   constructor(idProduct: number, nameProduct: string, description: string, listPrice: number, sellPrice: number, quantity: number, soldQuantity: number, discountPercent: number, dataImage: string,unit : string) {
      this.idProduct = idProduct;
      this.nameProduct = nameProduct;
      this.description = description;
      this.listPrice = listPrice;
      this.sellPrice = sellPrice;
      this.quantity = quantity;
      this.soldQuantity = soldQuantity;
      this.discountPercent = discountPercent;
      this.dataImage = dataImage;
      this.unit=unit;
   }
}

export default ProductModel;