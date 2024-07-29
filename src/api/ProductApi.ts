

import ProductModel from '../model/ProductModel';
import ProductTypeModel from '../model/ProductTypeModel';
import { endpointBE } from '../utils/Constant';
import { getAllImage } from './ImageApi';
import { getProductTypeByIdProduct } from './ProductTypeApi';
import { request, requestAdmin } from './Request';

interface resultInterface { // Tạo ra các biến trả về
   productList: ProductModel[];
   totalPage: number;
   size: number;
}

async function getProduct(endpoint: string): Promise<resultInterface> {
   // Gọi phương thức request()
   const response = await request(endpoint);

   // Lấy ra thông tin trang
   const totalPage: number = response.page.totalPages;
   const size: number = response.page.totalElements;

   // Lấy ra danh sách quyển sách
   const productList: ProductModel[] = response._embedded.products.map((productData: ProductModel) => ({
      ...productData,
   }))

   // Lấy ra ảnh của từng quyển sách
//    const bookList1 = await Promise.all(
//       sanPhamList.map(async (sanPham: SanPhamModel) => {
//          const responseImg = await getAllImageByBook(book.idBook);
//          const thumbnail = responseImg.filter(image => image.thumbnail);
//          return {
//             ...book,
//             thumbnail: thumbnail[0].urlImage,
//          };
//       })
//    );

   return { productList: productList, totalPage: totalPage, size: size };
}

export async function getAllProduct(size?: number, page?: number): Promise<resultInterface> {
   // Nếu không truyền size thì mặc định là 8
   if (!size) {
      size = 8;
   }

   // Xác định endpoint
   const endpoint: string = endpointBE + `/products?sort=idProduct,desc&size=${size}&page=${page}`;

   return getProduct(endpoint);
}

export async function getHotProduct(): Promise<resultInterface> {
   // Xác định endpoint
   const endpoint: string = endpointBE + "/books?sort=avgRating,desc&size=4";

   return getProduct(endpoint);
}

export async function getNewProduct(): Promise<resultInterface> {
   // Xác định endpoint
   const endpoint: string = endpointBE + "/products?sort=idProduct,desc&size=4";

   return getProduct(endpoint);
}

export async function getProductNew():Promise<resultInterface>{
    
    // xác định endpoit
     const duongDan : string = 'http://localhost:8080/products?sort=idProduct,desc&page=0&size=3';
    return  getProduct(duongDan);
  }

  export async function getProductByIdProductType(idProductType: number|undefined):Promise<resultInterface>{
   
   // xác định endpoit
    const endpoint : string = `http://localhost:8080/products/search/findByListProductTypes_idProductType?sort=idProduct,desc&size=12&page=0&idProductType=${idProductType}`;
   return  getProduct(endpoint);
 }

// export async function get3BestSellerBooks(): Promise<BookModel[]> {
//    const endpoint: string = endpointBE + "/books?sort=soldQuantity,desc&size=3";
//    let bookList = await getBook(endpoint);

//    // Use Promise.all to wait for all promises in the map to resolve
//    let newBookList = await Promise.all(bookList.bookList.map(async (book: any) => {
//       // Trả về quyển sách
//       const responseImg = await getAllImageByBook(book.idBook);
//       const thumbnail = responseImg.find(image => image.thumbnail);

//       return {
//          ...book,
//          thumbnail: thumbnail ? thumbnail.urlImage : null,
//       };
//    }));

//    return newBookList;
// }


export async function searchProduct(keySearch?: string, idProductType ?: number|undefined, filter?: number, size?: number, page?: number): Promise<resultInterface> {

   // Nếu key search không undifined
   if (keySearch) {
    keySearch = keySearch.trim();
   }

   const optionsShow = `size=${size}&page=${page}`;

   // Endpoint mặc định
   let endpoint: string = endpointBE + `/products?` + optionsShow;

   let filterEndpoint = '';
   if (filter === 1) {
      filterEndpoint = "sort=nameProduct";
   } else if (filter === 2) {
      filterEndpoint = "sort=nameProduct,desc";
   } else if (filter === 3) {
      filterEndpoint = "sort=";
   } else if (filter === 4) {
      filterEndpoint = "sort=sellPrice,desc";
   } else if (filter === 5) {
      filterEndpoint = "sort=soldQuantity,desc";
   }

   // Nếu có key search và không có lọc thể loại
   if (keySearch !== '') {
      // Mặc đinh nếu không có filter
      endpoint = endpointBE + `/products/search/findByNameProductContaining?nameProduct=${keySearch}&` + optionsShow + '&' + filterEndpoint;
   }

   // Nếu idGenre không undifined
   if (keySearch !== undefined) {
      // Nếu có không có key search và có lọc thể loại
      if (keySearch === '' &&  idProductType ? idProductType :0 > 0) {
         // Mặc định nếu không có filter
         endpoint = endpointBE + `/products/search/findByListProductTypes_IdProductType?idProductType=${idProductType}&` + optionsShow + '&' + filterEndpoint;
      }

      // Nếu có key search và có lọc thể loại
      if (keySearch!== '' && idProductType ? idProductType : 0> 0) {
         endpoint = endpointBE + `/products/search/findByNameProductContainingAndListProductTypes_IdProductType?nameProduct=${idProductType}&idProductType=${idProductType}&` + optionsShow + '&' + filterEndpoint;
      }

      // Chỉ lọc filter
      if (keySearch === '' && (idProductType === 0 || typeof (idProductType) === 'string')) {
         endpoint = endpointBE + "/products?" + optionsShow + '&' + filterEndpoint;
      }

      // console.log("idGenre: " + typeof (idGenre) + idGenre + ", filter: " + typeof (filter) + filter + ", keySearch" + +typeof (keySearch) + keySearch);
   }

   // console.log(endpoint);

   return getProduct(endpoint);
}

// Lấy sách theo id (chỉ lấy thumbnail)
export async function getProductById(idProduct: number): Promise<ProductModel | null> {
   let productResponse: ProductModel = {
      idProduct: 0,
      nameProduct: "",
      description: "",
      listPrice: NaN,
      sellPrice: NaN,
      quantity: NaN,
      soldQuantity: NaN,
      unit: "",
   }
   const endpoint = endpointBE + `/products/${idProduct}`;
   try {
      // Gọi phương thức request()
      const response = await request(endpoint);

      // Kiểm tra xem dữ liệu endpoint trả về có dữ liệu không
      if (response) {
         productResponse = response;
         // Trả về quyển sách
         const responseImg = await getAllImage(response.idProduct);
         const thumbnail = responseImg.filter(image => image.dataImage);
         return {
            ... productResponse,
            dataImage: thumbnail[0].dataImage,
         };
      } else {
         throw new Error("Sản phẩm không tồn tại");
      }

   } catch (error) {
      console.error('Error: ', error);
      return null;
   }
}

export async function getProductByIdCartItem(idCart: number): Promise<ProductModel | null> {
   const endpoint = endpointBE + `/cart-items/${idCart}/products`;

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

export async function getTotalNumberOfProducts(): Promise<number> {
   const endpoint = endpointBE + `/product/get-total`;
   try {
      // Gọi phương thức request()
      const response = await requestAdmin(endpoint);
      // Kiểm tra xem dữ liệu endpoint trả về có dữ liệu không
      if (response) {
         // Trả về số lượng cuốn sách
         return response;
      }
   } catch (error) {
      throw new Error("Lỗi không gọi được endpoint lấy tổng sản phẩm\n" + error);
   }
   return 0;
}
export async function get3BestSellerProducts(): Promise<ProductModel[]> {
   const endpoint: string = endpointBE + "/products?sort=soldQuantity,desc&size=3";
   let productList = await getProduct(endpoint);

   // Use Promise.all to wait for all promises in the map to resolve
   let newProductList = await Promise.all(productList.productList.map(async (product: any) => {
      // Trả về quyển sách
      const responseImg = await getAllImage(product.idProduct);
      const thumbnail = responseImg.find(image => image.isIcon);

      return {
         ...product,
         thumbnail: thumbnail ? thumbnail.urlImage : null,
      };
   }));

   return newProductList;
}
// // Lấy sách theo id (lấy thumbnail, ảnh liên quan, thể loại)
export async function getProductByIdAllInformation(idProduct: number): Promise<ProductModel | null> {
   let productResponse: ProductModel = {
      idProduct: 0,
		nameProduct: "",
		description: "",
		listPrice: NaN,
		sellPrice: NaN,
		quantity: NaN,
		soldQuantity: NaN,
		discountPercent: 0,
		relatedImg: [],
        dataImage: "",
        idProductType: [],
        producttypesList : [],
        unit : "",
   }

   try {
      // Gọi phương thức request()
      const response = await getProductById(idProduct);

      // Kiểm tra xem dữ liệu endpoint trả về có dữ liệu không
      if (response) {
         // Lưu dữ liệu sách
         productResponse = response;

         // Lấy tất cả hình ảnh của sách
         const imagesList = await getAllImage(response.idProduct);
         const thumbnail = imagesList.find((image) => image.isIcon);
         const relatedImg = imagesList.map((image) => {
            // Sử dụng conditional (ternary) để trả về giá trị
            return !image.isIcon ? image.urlImage || image.dataImage : null;
         }).filter(Boolean); // Loại bỏ các giá trị null



       productResponse = { ...productResponse, relatedImg: relatedImg as string[], dataImage: thumbnail?.urlImage || thumbnail?.dataImage };

         // Lấy tất cả thể loại của sách
         const productTypesList = await getProductTypeByIdProduct(response.idProduct);
         productTypesList.productTypeList.forEach((productType) => {
            const dataProductType: ProductTypeModel = { idProductType: productType.idProductType, nameProductType: productType.nameProductType };
          productResponse = { ...productResponse, producttypesList: [...productResponse.producttypesList || [], dataProductType] };
         })

         return productResponse;
      } else {
         throw new Error("Sản phẩm không tồn tại");
      }

   } catch (error) {
      console.error('Error: ', error);
      return null;
   }
}