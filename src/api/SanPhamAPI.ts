
import SanPhamModel from '../model/SanPhamModel';
import { endpointBE } from '../utils/Enpoint';
import { layToanBoAnh } from './HinhAnhAPI';
import { request, requestAdmin } from './Request';

interface resultInterface { // Tạo ra các biến trả về
   sanPhamList: SanPhamModel[];
   tongTrang: number;
   size: number;
}

async function getProduct(endpoint: string): Promise<resultInterface> {
   // Gọi phương thức request()
   const response = await request(endpoint);

   // Lấy ra thông tin trang
   const totalPage: number = response.page.totalPages;
   const size: number = response.page.totalElements;

   // Lấy ra danh sách quyển sách
   const sanPhamList: SanPhamModel[] = response._embedded.sanPhams.map((sanPhamData: SanPhamModel) => ({
      ...sanPhamData,
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

   return { sanPhamList: sanPhamList, tongTrang: totalPage, size: size };
}

export async function getAllProduct(size?: number, page?: number): Promise<resultInterface> {
   // Nếu không truyền size thì mặc định là 8
   if (!size) {
      size = 8;
   }

   // Xác định endpoint
   const endpoint: string = endpointBE + `/san-pham?sort=maSanPham,desc&size=${size}&page=${page}`;

   return getProduct(endpoint);
}

export async function getHotProduct(): Promise<resultInterface> {
   // Xác định endpoint
   const endpoint: string = endpointBE + "/books?sort=avgRating,desc&size=4";

   return getProduct(endpoint);
}

export async function getNewBook(): Promise<resultInterface> {
   // Xác định endpoint
   const endpoint: string = endpointBE + "/san-pham?sort=maSanPham,desc&size=4";

   return getProduct(endpoint);
}

export async function layBaSanPhamMoiNhat():Promise<resultInterface>{
    const ketQua : SanPhamModel[] = [];
    // xác định endpoit
     const duongDan : string = 'http://localhost:8080/san-pham?sort=maSanPham,desc&page=0&size=3';
    return  getProduct(duongDan);
  }

  export async function laySanPhamTheoMaSanPham(maLoaiSanPham: number|undefined):Promise<resultInterface>{
   const ketQua : SanPhamModel[] = [];
   // xác định endpoit
    const duongDan : string = `http://localhost:8080/san-pham/search/findByDanhSachLoaiSanPham_MaLoaiSanPham?sort=maSanPham,desc&size=12&page=0&maLoaiSanPham=${maLoaiSanPham}`;
   return  getProduct(duongDan);
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


export async function searchProduct(tuKhoaTimKiem?: string, maLoaiSanPham ?: number|undefined, filter?: number, size?: number, page?: number): Promise<resultInterface> {

   // Nếu key search không undifined
   if (tuKhoaTimKiem) {
      tuKhoaTimKiem = tuKhoaTimKiem.trim();
   }

   const optionsShow = `size=${size}&page=${page}`;

   // Endpoint mặc định
   let endpoint: string = endpointBE + `/san-pham?` + optionsShow;

   let filterEndpoint = '';
   if (filter === 1) {
      filterEndpoint = "sort=tenSanPham";
   } else if (filter === 2) {
      filterEndpoint = "sort=tenSanPham,desc";
   } else if (filter === 3) {
      filterEndpoint = "sort=giaBan";
   } else if (filter === 4) {
      filterEndpoint = "sort=giaBan,desc";
   } else if (filter === 5) {
      filterEndpoint = "sort=soLuongBan,desc";
   }

   // Nếu có key search và không có lọc thể loại
   if (tuKhoaTimKiem !== '') {
      // Mặc đinh nếu không có filter
      endpoint = endpointBE + `/san-pham/search/findByTenSanPhamContaining?tenSanPham=${tuKhoaTimKiem}&` + optionsShow + '&' + filterEndpoint;
   }

   // Nếu idGenre không undifined
   if (tuKhoaTimKiem !== undefined) {
      // Nếu có không có key search và có lọc thể loại
      if (tuKhoaTimKiem === '' &&  maLoaiSanPham ? maLoaiSanPham :0 > 0) {
         // Mặc định nếu không có filter
         endpoint = endpointBE + `/san-pham/search/findByDanhSachLoaiSanPham_MaLoaiSanPham?maLoaiSanPham=${maLoaiSanPham}&` + optionsShow + '&' + filterEndpoint;
      }

      // Nếu có key search và có lọc thể loại
      if (tuKhoaTimKiem!== '' && maLoaiSanPham ? maLoaiSanPham : 0> 0) {
         endpoint = endpointBE + `/san-pham/search/findByTenSanPhamContainingAndDanhSachLoaiSanPham_MaLoaiSanPham?tenSanPham=${maLoaiSanPham}&maLoaiSanPham=${maLoaiSanPham}&` + optionsShow + '&' + filterEndpoint;
      }

      // Chỉ lọc filter
      if (tuKhoaTimKiem === '' && (maLoaiSanPham=== 0 || typeof (maLoaiSanPham) === 'string')) {
         endpoint = endpointBE + "/san-pham?" + optionsShow + '&' + filterEndpoint;
      }

      // console.log("idGenre: " + typeof (idGenre) + idGenre + ", filter: " + typeof (filter) + filter + ", keySearch" + +typeof (keySearch) + keySearch);
   }

   // console.log(endpoint);

   return getProduct(endpoint);
}

// Lấy sách theo id (chỉ lấy thumbnail)
export async function getProductById(maSanPham: number): Promise<SanPhamModel | null> {
   let productResponse: SanPhamModel = {
      maSanPham: 0,
      tenSanPham: "",
      moTa: "",
      duongDanAnh: "",
      giaNiemYet: NaN,
      giaBan: NaN,
      soLuong: NaN,
      phanTramGiamGia: NaN,
      soLuongBan: NaN,
      donViTinh: "",
   }
   const endpoint = endpointBE + `/san-pham/${maSanPham}`;
   try {
      // Gọi phương thức request()
      const response = await request(endpoint);

      // Kiểm tra xem dữ liệu endpoint trả về có dữ liệu không
      if (response) {
         productResponse = response;
         // Trả về quyển sách
         const responseImg = await layToanBoAnh(response.maSanPham);
         const thumbnail = responseImg.filter(image => image.duLieuAnh);
         return {
            ... productResponse,
            duongDanAnh: thumbnail[0].duLieuAnh,
         };
      } else {
         throw new Error("Sản phẩm không tồn tại không tồn tại");
      }

   } catch (error) {
      console.error('Error: ', error);
      return null;
   }
}

export async function getProductByIdCartItem(maGioHang: number): Promise<SanPhamModel | null> {
   const endpoint = endpointBE + `/gio-hang/${maGioHang}/san-pham`;

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

// export async function getTotalNumberOfBooks(): Promise<number> {
//    const endpoint = endpointBE + `/book/get-total`;
//    try {
//       // Gọi phương thức request()
//       const response = await requestAdmin(endpoint);
//       // Kiểm tra xem dữ liệu endpoint trả về có dữ liệu không
//       if (response) {
//          // Trả về số lượng cuốn sách
//          return response;
//       }
//    } catch (error) {
//       throw new Error("Lỗi không gọi được endpoint lấy tổng cuốn sách\n" + error);
//    }
//    return 0;
// }

// // Lấy sách theo id (lấy thumbnail, ảnh liên quan, thể loại)
// export async function getBookByIdAllInformation(idBook: number): Promise<BookModel | null> {
//    let bookResponse: BookModel = {
//       idBook: 0,
//       nameBook: "",
//       author: "",
//       description: "",
//       listPrice: NaN,
//       sellPrice: NaN,
//       quantity: NaN,
//       avgRating: NaN,
//       soldQuantity: NaN,
//       discountPercent: NaN,
//       thumbnail: "",
//       relatedImg: [],
//       idGenres: [],
//       genresList: [],
//    }

//    try {
//       // Gọi phương thức request()
//       const response = await getBookById(idBook);

//       // Kiểm tra xem dữ liệu endpoint trả về có dữ liệu không
//       if (response) {
//          // Lưu dữ liệu sách
//          bookResponse = response;

//          // Lấy tất cả hình ảnh của sách
//          const imagesList = await getAllImageByBook(response.idBook);
//          const thumbnail = imagesList.find((image) => image.thumbnail);
//          const relatedImg = imagesList.map((image) => {
//             // Sử dụng conditional (ternary) để trả về giá trị
//             return !image.thumbnail ? image.urlImage || image.dataImage : null;
//          }).filter(Boolean); // Loại bỏ các giá trị null



//          bookResponse = { ...bookResponse, relatedImg: relatedImg as string[], thumbnail: thumbnail?.urlImage || thumbnail?.dataImage };

//          // Lấy tất cả thể loại của sách
//          const genresList = await getGenreByIdBook(response.idBook);
//          genresList.genreList.forEach((genre) => {
//             const dataGenre: GenreModel = { idGenre: genre.idGenre, nameGenre: genre.nameGenre };
//             bookResponse = { ...bookResponse, genresList: [...bookResponse.genresList || [], dataGenre] };
//          })

//          return bookResponse;
//       } else {
//          throw new Error("Sách không tồn tại");
//       }

//    } catch (error) {
//       console.error('Error: ', error);
//       return null;
//    }
// }