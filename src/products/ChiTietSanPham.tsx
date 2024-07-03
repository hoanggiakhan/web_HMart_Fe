/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useScrollToTop from "../hooks/ScrollToTop";
import { useCartItem } from "../utils/CartItemContext";
import SanPhamModel from "../model/SanPhamModel";
import { getProductById } from "../api/SanPhamApi";
import LoaiSanPhamModel from "../model/LoaiSanPhamModel";
import { getGenreByIdSanpham } from "../api/LoaiSanPhamAPI";
import HinhAnhModel from "../model/HinhAnhModel";
import { layToanBoAnh } from "../api/HinhAnhAPI";
import { getIdUserByToken, isToken } from "../utils/JwtService";
import { endpointBE } from "../utils/Enpoint";
import { toast } from "react-toastify";
import GioHangModel from "../model/GioHangModel";
import { Button, Skeleton } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import ReactSimpleImageViewer from "react-simple-image-viewer";
import { ShoppingCartOutlined } from "@mui/icons-material";
import SelectQuantity from "./componets/select-quantity/SelectQuantity";
import HinhAnhSanPham from "./HinhAnhSanPham";
import SanPhamList from "./SanPhamList";
import SanPhamLienQuan from "./SanPhamLienQuan";
import { CheckoutPage } from "../pages/CheckoutPage";


interface BookDetailProps {}

const ChiTietSanPham: React.FC<BookDetailProps> = (props) => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng
	const { setTongSP, gioHangList } = useCartItem();

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
	const [loading, setLoading] = useState(true);
	const [erroring, setErroring] = useState(null);
	// Lấy sách ra
	useEffect(() => {
		getProductById(maSanPhamNumber)
			.then((response) => {
				setSanPham(response);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				setErroring(error.message);
			});
	}, []);

	// Lấy ra thể loại của sách
	const [genres, setGenres] = useState<LoaiSanPhamModel[] | null>(null);
	useEffect(() => {
		getGenreByIdSanpham(maSanPhamNumber).then((response) => {
			setGenres(response.loaiSPList);
		});
	}, []);
	const maLoai : number | undefined = 1;
	
	// Lấy ra hình ảnh của sách
	const [images, setImages] = useState<HinhAnhModel[] | null>(null);
	useEffect(() => {
		layToanBoAnh(maSanPhamNumber)
			.then((response) => {
				setImages(response);
			})
			.catch((error) => {
				console.error(error);
			});
			console.log(maLoai);
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
		// cái isExistproduct này sẽ tham chiếu đến cái cart ở trên, nên khi update thì cart nó cũng update theo
		let isExistproduct = gioHangList.find(
			(cartItem) => cartItem.sanPham.maSanPham === sanPhamMoi.maSanPham
		);
		// Thêm 1 sản phẩm vào giỏ hàng
		if (isExistproduct) {
			// nếu có rồi thì sẽ tăng số lượng
			isExistproduct.soLuong += soLuong;

			// Lưu vào db
			if (isToken()) {
				const request = {
					maGioHang: isExistproduct.maGioHang,
					soLuong: isExistproduct.soLuong,
				};
				const token = localStorage.getItem("token");
				fetch(endpointBE + `/gio-hangs/update-item`, {
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
                            soLuong: 1,
                            sanPham: sanPhamMoi,
                            maNguoiDung: getIdUserByToken(),
                        },
                    ];
                    const token = localStorage.getItem("token");
                    const response = await fetch(
                        endpointBE + "/gio-hangs/them-san-pham",
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
                        gioHangList.push({
                            maGioHang: maGioHang,
                            soLuong: 1,
                            sanPham: sanPhamMoi,
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                gioHangList.push({
                    soLuong: 1,
                    sanPham: sanPhamMoi,
                });
            }
		}
		// Lưu vào localStorage
		localStorage.setItem("cart", JSON.stringify(gioHangList));
		// Thông báo toast
		toast.success("Thêm vào giỏ hàng thành công");
		setTongSP(gioHangList.length);
	};

	// Viewer hình ảnh
	const [currentImage, setCurrentImage] = useState(0);
	const [isViewerOpen, setIsViewerOpen] = useState(false);

	let imageList: string[] = [];
	if (images !== undefined && images !== null) {
		imageList = images.map((image) => {
			return image.duLieuAnh || image.duongDan;
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
	const [cartItem, setCartItem] = useState<GioHangModel[]>([]);
	const [totalPriceProduct, setTotalPriceProduct] = useState(0);
	function handleBuyNow(sanPhamMoi: SanPhamModel) {
		setCartItem([{ soLuong , sanPham: sanPhamMoi }]);
		setIsCheckout(!isCheckout);
		setTotalPriceProduct(sanPhamMoi.giaBan * soLuong);
	}

	if (loading) {
		return (
			<div className='container-book container mb-5 py-5 px-5 bg-light'>
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

	if (erroring) {
		return (
			<div>
				<h1>Gặp lỗi: {erroring}</h1>
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
			{!isCheckout ? (
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
							   <del>{sanPham.giaNiemYet} đ</del>
							 </span>
							 <br />
							 <span className="discounted-price text-danger">
							   <strong>{sanPham.giaBan} đ</strong>
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
			) : (
				<CheckoutPage
					setIsCheckout={setIsCheckout}
					cartList={cartItem}
					totalPriceProduct={totalPriceProduct}
					isBuyNow={true}
				/>
				
			)}
		</>
	);
};

export default ChiTietSanPham;
