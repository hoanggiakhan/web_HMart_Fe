
import React, { useCallback, useEffect, useState } from "react";
import SanPhamModel from "../../model/SanPhamModel";
import { laySanPhamTheoMaSanPham } from "../../api/SanPhamAPI";
import HinhAnhModel from "../../model/HinhAnhModel";
import { layToanBoAnh } from "../../api/HinhAnhAPI";
import HinhAnhSanPham from "./components/HinhAnhSanPham";
import dinhDangSo from "../utils/DinhDangSo";
import useScrollToTop from "../../hooks/ScrollToTop";
import { useCartItem } from "../utils/GioHangContext";
import { getIdUserByToken, isToken } from "../utils/JwtService";
import { toast } from "react-toastify";
import LoaiSanPhamModel from "../../model/LoaiSanPhamModel";
import { layLoaiSanPhamTheoMaSP } from "../../api/LoaiSanPhamApi";
import GioHangModel from "../../model/GioHangModel";
import { Skeleton } from "@mui/material";
import SelectQuantity from "./components/select-quantity/SelectQuantity";
import { useParams } from "react-router-dom";

interface SanPhamProps{
  
}

const ChiTietSanPham: React.FC<SanPhamProps> = (props) => {
  useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng
	const { setTongGioHang , gioHang } = useCartItem();

	// Lấy mã sách từ url
	const { maSanPham } = useParams();
	let maSanPhamNumber: number = 0;

	// Ép kiểu về number
	try {
		maSanPhamNumber = parseInt(maSanPham + "");
		if (Number.isNaN(maSanPhamNumber)) {
			maSanPhamNumber = 0;
		}
	} catch (error) {
		console.error("Error: " + error);
	}

	// Khai báo biến
	const [sanPham, setSanPham] = useState<SanPhamModel | null>(null);
	const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
	const [baoLoi, setBaoLoi] = useState(null);
	// Lấy sách ra
	useEffect(() => {
		laySanPhamTheoMaSanPham(maSanPhamNumber)
			.then((response) => {
				setSanPham(response);
				setDangTaiDuLieu(false);
			})
			.catch((error) => {
				setDangTaiDuLieu(false);
				setBaoLoi(error.message);
			});
	}, []);
	// Lấy ra hình ảnh của sách
	const [hinhAnh, setHinhAnh] = useState<HinhAnhModel[] | null>(null);
	useEffect(() => {
		layToanBoAnh(maSanPhamNumber)
			.then((response) => {
				setHinhAnh(response);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const [soLuong, setSoLuong] = useState(1);
	// Xử lý tăng số lượng
	const add = () => {
		if (soLuong < (sanPham?.soLuong ? sanPham?.soLuong : 1)) {
			setSoLuong(soLuong + 1);
		}
	};

	// Xử lý giảm số lượng
	const reduce = () => {
		if (soLuong > 1) {
			setSoLuong(soLuong - 1);
		}
	};

	// Xử lý thêm sản phẩm vào giỏ hàng
	const handleAddProduct = async (sanPhamMoi: SanPhamModel) => {
		// cái isExistBook này sẽ tham chiếu đến cái cart ở trên, nên khi update thì cart nó cũng update theo
		let isExistProduct = gioHang.find(
			(matHang) => matHang.sanPham.maSanPham === sanPhamMoi.maSanPham
		);
		const soLuong = 1; // Ensure soLuong is defined and set to a proper value
	
		// Thêm 1 sản phẩm vào giỏ hàng
		if (isExistProduct) {
			// nếu có rồi thì sẽ tăng số lượng
			isExistProduct.soLuong += soLuong;
	
			// Lưu vào db
			if (isToken()) {
				const request = {
					idCart: isExistProduct.maGioHang,
					quantity: isExistProduct.soLuong,
				};
				const token = localStorage.getItem("token");
				fetch(`http://localhost:8080/gio-hangs/update-item`, {
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"content-type": "application/json",
					},
					body: JSON.stringify(request),
				}).catch((err) => console.log(err));
			}
		} else {
			// Lưu vào db
			if (isToken()) {
				try {
					const request = [
						{
							soLuong: soLuong,
							sanPham: sanPhamMoi,
							idUser: getIdUserByToken(),
						},
					];
					const token = localStorage.getItem("token");
					const response = await fetch(
						`http://localhost:8080/gio-hangs/them-san-pham`,
						{
							method: "POST",
							headers: {
								Authorization: `Bearer ${token}`,
								"content-type": "application/json",
							},
							body: JSON.stringify(request),
						}
					);
	
					if (response.ok) {
						const maGioHang = await response.json();
						gioHang.push({
							maGioHang: maGioHang,
							soLuong: soLuong,
							sanPham: sanPhamMoi,
						});
					} else {
						console.log('Failed to add product to cart:', await response.text());
					}
				} catch (error) {
					console.log(error);
				}
			} else {
				gioHang.push({
					soLuong: soLuong,
					sanPham: sanPhamMoi,
				});
			}
		}
		// Lưu vào localStorage
		localStorage.setItem("cart", JSON.stringify(gioHang));
		// Thông báo toast
		toast.success("Thêm vào giỏ hàng thành công");
		setTongGioHang(gioHang.length);
	};

	// Viewer hình ảnh
	const [currentImage, setCurrentImage] = useState(0);
	const [isViewerOpen, setIsViewerOpen] = useState(false);

	let imageList: string[] = [];
	if (hinhAnh !== undefined && hinhAnh !== null) {
		imageList = hinhAnh.map((image) => {
			return image.duongDan || image.duLieuAnh;
		}) as string[];
	}

	const openImageViewer = useCallback((index: number) => {
		setCurrentImage(index);
		setIsViewerOpen(true);
	}, []);

	const closeImageViewer = () => {
		setCurrentImage(0);
		setIsViewerOpen(false);
	};

	const [isCheckout, setIsCheckout] = useState(false);
	const [matHang, setMatHang] = useState<GioHangModel[]>([]);
	const [tongTien, setTongTien] = useState(0);
	if (dangTaiDuLieu) {
		return (
			<div className='container-sanPham container mb-5 py-5 px-5 bg-light'>
				<div className='row'>
					<div className='col-4'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
					<div className='col-8 px-5'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={100}
						/>
						<Skeleton className='my-3' variant='rectangular' />
						<Skeleton className='my-3' variant='rectangular' />
						<Skeleton className='my-3' variant='rectangular' />
					</div>
				</div>
			</div>
		);
	}

	if (baoLoi) {
		return (
			<div>
				<h1>Gặp lỗi: {baoLoi}</h1>
			</div>
		);
	}

	if (sanPham === null) {
		return (
			<div>
				<h1>Sản phẩm không tồn tại </h1>
			</div>
		);
	}
  return (
    <>
    {!isCheckout ?(
      <>
        <div className="container">
      <div className="row mt-4 mb-4">
        <div className="col-4">
          <HinhAnhSanPham maSanPham={maSanPhamNumber} />
        </div>
        <div className="col-8">
          <div className="row">
            <div className="col-12">
              <h1 className="text-left">
                {sanPham.tenSanPham} - {sanPham.donViTinh}
              </h1>
              <div className="row mt-4 text-left">
                <div className="col-4">
                  <p className="mb-1">Giá niêm yết:</p>
                  <p className="mb-1">Giá khuyến mãi:</p>
                </div>
                <div className="col-8">
                  <div className="price mb-2">
                    <span className="original-price text-muted">
                      <del>{dinhDangSo(sanPham.giaNiemYet)} đ</del>
                    </span>
                    <br />
                    <span className="discounted-price text-danger">
                      <strong>{dinhDangSo(sanPham.giaBan)} đ</strong>
                    </span>
                  </div>
                </div>
              </div>
              <hr />
              {/* <div className="row mt-4 text-left">
                <div className="col-4">Tình trạng:</div>
                <div className="col-8">{soLuongKho > 0 ? 'Còn hàng' : 'Hết hàng'}</div>
              </div> */}
              <div className="row align-items-center mt-4 mb-4">
               
                <div className='d-flex align-items-center mt-3'>
									<strong className='me-5'>Số lượng: </strong>
									<SelectQuantity
										max={sanPham.soLuong}
										quantity={soLuong}
										setQuantity={setSoLuong}
										add={add}
										reduce={reduce}
									/>
									<span className='ms-4'>
										{sanPham.soLuong} sản phẩm có sẵn
									</span>
								</div>
              </div>
              <button className="btn btn-danger btn-block" onClick={()=>handleAddProduct(sanPham)}> <i className="fas fa-shopping-cart"></i>  Thêm vào giỏ hàng</button>
            </div>
          </div>
        </div>
       </div>
          
       </div>
     
       
      </>
    ):(
      <div>Đăng xuất</div>
    )

    }
    </>
  );
}
export default ChiTietSanPham;