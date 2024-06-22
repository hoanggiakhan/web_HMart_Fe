/* eslint-disable @typescript-eslint/no-redeclare */
import { Skeleton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import GioHangModel from "../../model/GioHangModel";
import { useCartItem } from "../utils/GioHangContext";
import { useConfirm } from "material-ui-confirm";
import HinhAnhModel from "../../model/HinhAnhModel";
import { isToken } from "../utils/JwtService";
import { layAnhCuaMotSanPham, layMotAnh } from "../../api/HinhAnhAPI";
import TextEllipsis from "./components/text-ellipsis/TextEllipsis";
import SelectQuantity from "./components/select-quantity/SelectQuantity";

interface SanPhamGioHang {
	gioHang: GioHangModel;
	handleRemoveBook: any;
}

const SanPhamGioHang: React.FC<SanPhamGioHang> = (props) => {
	const { setGioHang } = useCartItem();

	const confirm = useConfirm();

	// Tạo các biến
	const [soLuong, setSoLuong] = useState(
		props.gioHang.sanPham.soLuong !== undefined
			? props.gioHang.soLuong > props.gioHang.sanPham.soLuong
				? props.gioHang.sanPham.soLuong
				: props.gioHang.soLuong
			: props.gioHang.soLuong
	);
	const [imageList, setImageList] = useState<HinhAnhModel[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [erroring, setErroring] = useState(null);

	function handleConfirm() {
		confirm({
			title: "Xoá sản phẩm",
			description: "Bạn muốn bỏ sản phẩm này khỏi giỏ hàng không",
			confirmationText: "Xoá",
			cancellationText: "Huỷ",
		})
			.then(() => {
				props.handleRemoveBook(props.gioHang.sanPham.maSanPham);
				if (isToken()) {
					const token = localStorage.getItem("token");
					fetch(`http://localhost:8080/gio-hang/${props.gioHang.maGioHang}`, {
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${token}`,
							"content-type": "application/json",
						},
					}).catch((err) => console.log(err));
				}
			})
			.catch(() => {});
	}

	// Lấy ảnh ra từ BE
	useEffect(() => {
		layMotAnh(props.gioHang.sanPham.maSanPham)
			.then((response) => {
				setImageList(response);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				setErroring(error.message);
			});
	}, [props.gioHang.sanPham.maSanPham]);

	// Loading ảnh thumbnail
	let dataImage;
	if (imageList[0]) {
		const thumbnail = imageList.filter((i) => i.laICon);
		dataImage = thumbnail[0].duongDan || thumbnail[0].duLieuAnh;
	}

	// Xử lý tăng số lượng
	const add = () => {
		if (soLuong) {
			if (
				soLuong <
				(props.gioHang.sanPham.soLuong ? props.gioHang.sanPham.soLuong : 1)
			) {
				setSoLuong(soLuong + 1);
				handleModifiedsoLuong(props.gioHang.sanPham.maSanPham, 1);
			} else {
				toast.warning("Số lượng tồn kho không đủ");
			}
		}
	};

	// Xử lý giảm số lượng
	const reduce = () => {
		if (soLuong) {
			// Nếu số lượng về không thì xoá sản phẩm đó
			if (soLuong - 1 === 0) {
				handleConfirm();
			} else if (soLuong > 1) {
				setSoLuong(soLuong - 1);
				handleModifiedsoLuong(props.gioHang.sanPham.maSanPham, -1);
			}
		}
	};

	// Xử lý cập nhật lại soLuong trong localstorage / database
	function handleModifiedsoLuong(maSanPham: number, soLuong: number) {
		const cartData: string | null = localStorage.getItem("cart");
		const cart: GioHangModel[] = cartData ? JSON.parse(cartData) : [];
		// cái isExistBook này sẽ tham chiếu đến cái cart ở trên, nên khi update thì cart nó cũng update theo
		let isExistBook = cart.find(
			(gioHang) => gioHang.sanPham.maSanPham === maSanPham
		);
		// Thêm 1 sản phẩm vào giỏ hàng
		if (isExistBook) {
			// nếu có rồi thì sẽ tăng số lượng
			isExistBook.soLuong += soLuong;

			// Cập nhật trong db
			if (isToken()) {
				const token = localStorage.getItem("token");
				fetch(`http://localhost:8080/gio-hang/update-item`, {
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"content-type": "application/json",
					},
					body: JSON.stringify({
						idCart: props.gioHang.maGioHang,
						soLuong: isExistBook.soLuong,
					}),
				}).catch((err) => console.log(err));
			}
		}
		// Cập nhật lại
		localStorage.setItem("cart", JSON.stringify(cart));
		setGioHang(cart);
	}

	if (loading) {
		return (
			<>
				<Skeleton className='my-3' variant='rectangular' />
			</>
		);
	}

	if (erroring) {
		return (
			<>
				<h4>Lỗi ...</h4>
			</>
		);
	}
    const giaBan = props.gioHang.sanPham.giaBan !== undefined ? props.gioHang.sanPham.giaBan : 0;
    const giaNiemYet = props.gioHang.sanPham.giaNiemYet !==undefined ? props.gioHang.sanPham.giaNiemYet: 0;
	return (
		<>
			<div className='col'>
				<div className='d-flex'>
					<Link to={`/book/${props.gioHang.sanPham.maSanPham}`}>
						<img
							src={dataImage}
							className='card-img-top'
							alt={props.gioHang.sanPham.tenSanPham}
							style={{ width: "100px" }}
						/>
					</Link>
					<div className='d-flex flex-column pb-2'>
						<Link to={`/book/${props.gioHang.sanPham.maSanPham}`}>
							<Tooltip title={props.gioHang.sanPham.tenSanPham} arrow>
								<span className='d-inline'>
									<TextEllipsis
										text={props.gioHang.sanPham.tenSanPham + " "}
										limit={38}
									/>
								</span>
							</Tooltip>
						</Link>
						<div className='mt-auto'>
							<span className='discounted-price text-danger'>
								<strong style={{ fontSize: "22px" }}>
									{giaBan.toLocaleString()}đ
								</strong>
							</span>
							<span
								className='original-price ms-3 small'
								style={{ color: "#000" }}
							>
								<del>
									{giaNiemYet.toLocaleString()}đ
								</del>
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className='col-3 text-center my-auto d-flex align-items-center justify-content-center'>
				<SelectQuantity
					max={props.gioHang.sanPham.soLuong}
					setQuantity={setSoLuong}
					quantity={soLuong}
					add={add}
					reduce={reduce}
					sanPham={props.gioHang.sanPham}
				/>
			</div>
			<div className='col-2 text-center my-auto'>
				<span className='text-danger'>
					<strong>
						{(soLuong * giaBan).toLocaleString()}đ
					</strong>
				</span>
			</div>
			<div className='col-2 text-center my-auto'>
				<Tooltip title={"Xoá sản phẩm"} arrow>
					<button
						style={{
							outline: 0,
							backgroundColor: "transparent",
							border: 0,
						}}
						onClick={() => handleConfirm()}
					>
						{/* <DeleteOutlineOutlinedIcon sx={{ cursor: "pointer" }} /> */}
					</button>
				</Tooltip>
			</div>
			<hr className='my-3' />
		</>
	);
};

export default SanPhamGioHang;
