class ProductTypeModel {
   id?: number;
   idProductType: number;
   nameProductType: string;

   constructor(idProductType: number, nameProductType: string) {
      this.idProductType = idProductType;
      this.nameProductType = nameProductType;
   }
}

export default ProductTypeModel;