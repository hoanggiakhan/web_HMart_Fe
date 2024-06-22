/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import useScrollToTop from "../../hooks/ScrollToTop";
import { useParams } from "react-router-dom";
import SanPhamModel from "../../model/SanPhamModel";
import { laySanPhamTheoMaSanPham } from "../../api/SanPhamAPI";
import { layLoaiSanPhamTheoMaSP } from "../../api/LoaiSanPhamApi";
import HinhAnhModel from "../../model/HinhAnhModel";
import { layToanBoAnh } from "../../api/HinhAnhAPI";
import { getIdUserByToken, isToken } from "../utils/JwtService";
import { toast } from "react-toastify";
import { GioHang } from "../../model/GioHang";
import GioHangModel from "../../model/GioHangModel";
import { Button, Skeleton } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import ReactSimpleImageViewer from "react-simple-image-viewer";
import RatingStar from "./components/rating/Rating";
import SelectQuantity from "./components/select-quantity/SelectQuantity";
import TextEllipsis from "./components/text-ellipsis/TextEllipsis";
import { useCartItem } from "../utils/GioHangContext";
import LoaiSanPhamModel from "../../model/LoaiSanPhamModel";
import HinhAnhSanPham from "./components/HinhAnhSanPham";


interface sanPhamDetailProps {}

const ChiTiet: React.FC<sanPhamDetailProps> = (props) => {
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

	// Lấy ra thể loại của sản phẩm
	const [loaiSanPham, setLoaiSanPham] = useState<LoaiSanPhamModel[] | null>(null);
	useEffect(() => {
		    layLoaiSanPhamTheoMaSP(maSanPhamNumber).then((response) => {
			setLoaiSanPham(response.danhSachLoaiSanPham);
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
				fetch( `http://localhost:8080/gio-hang/update-item`, {
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
							soLuong : soLuong,
							sanPham: sanPhamMoi,
							idUser: getIdUserByToken(),
						},
					];
					const token = localStorage.getItem("token");
					const response = await fetch(
						 "`http://localhost:8080/gio-hang/them-san-pham",
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
	function handleBuyNow(sanPhamMoi: SanPhamModel) {
		setMatHang([{ soLuong, sanPham: sanPhamMoi }]);
		setIsCheckout(!isCheckout);
		// setTongTien(sanPhamMoi.giaBan* soLuong);
	}

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
			{!isCheckout ? (
				<>
					<div className='container p-2 bg-white my-3 rounded'>
						<div className='row mt-4 mb-4'>
							<div className='col-lg-4 col-md-4 col-sm-12'>
								<Carousel
									emulateTouch={true}
									swipeable={true}
									showIndicators={false}
								>
									{hinhAnh?.map((image, index) => (
										<div
											key={index}
											onClick={() => openImageViewer(index)}
											style={{
												width: "100%",
												height: "400px",
												objectFit: "cover",
											}}
										>
											<img
												alt=''
												src={
													image.duLieuAnh
														? image.duLieuAnh
														: image.duongDan
												}
											/>
										</div>
									))}
								</Carousel>
								{isViewerOpen && (
									<HinhAnhSanPham maSanPham={maSanPhamNumber}/>
								)}
							</div>
							<div className='col-lg-8 col-md-8 col-sm-12 px-5'>
								<h2>{sanPham.tenSanPham}</h2>
								<div className='d-flex align-items-center'>
									<p className='me-5'>
										Thể loại:{" "}
										<strong>
											{loaiSanPham?.map((genre) => genre.tenLoaiSanPham + " ")}
										</strong>
									</p>
								</div>
								<div className='d-flex align-items-center'>
									<div className='d-flex align-items-center'>
										<span className='mx-3 mb-1 text-secondary'>
											|
										</span>
									</div>
								</div>
								<div className='price'>
									<span className='discounted-price text-danger me-3'>
										<strong style={{ fontSize: "32px" }}>
											{sanPham.giaBan?.toLocaleString()}đ
										</strong>
									</span>
									<span className='original-price small me-3'>
										<strong>
											<del>{sanPham.giaNiemYet?.toLocaleString()}đ</del>
										</strong>
									</span>
									{/* <h4 className='my-0 d-inline-block'>
										<span className='badge bg-danger'>
											{sanPham.discountPercent}%
										</span>
									</h4> */}
								</div>
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
								<div className='mt-4 d-flex align-items-center'>
									{sanPham.soLuong === 0 ? (
										<Button
											variant='outlined'
											size='large'
											className='me-3'
											color='error'
										>
											Hết hàng
										</Button>
									) : (
										<>
											<Button
												variant='outlined'
												size='large'
												// startIcon={<ShoppingCartOutlined />}
												className='me-3'
												onClick={() => handleAddProduct(sanPham)}
											>
												Thêm vào giỏ hàng
											</Button>
											<Button
												variant='contained'
												size='large'
												className='ms-3'
												onClick={() => handleBuyNow(sanPham)}
											>
												Mua ngay
											</Button>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className='container p-4 bg-white my-3 rounded'>
						<h5 className='my-3'>Mô tả sản phẩm</h5>
						<hr />
						<TextEllipsis
							isShow={true}
							text={sanPham.moTa + ""}
							limit={1000}
						/>
					</div>
					{/* <div className='container p-4 bg-white my-3 rounded'>
						<h5 className='my-3'>Khách hàng đánh giá</h5>
						<hr />
						<Comment maSanPham={maSanPhamNumber} />
					</div> */}
				</>
			) : (

				<div>Đăng xuất</div>
				// <CheckoutPage
				// 	setIsCheckout={setIsCheckout}
				// 	cartList={cartItem}
				// 	totalPriceProduct={totalPriceProduct}
				// 	isBuyNow={true}
				// />
			)}
		</>
	);
};

export default ChiTiet;
