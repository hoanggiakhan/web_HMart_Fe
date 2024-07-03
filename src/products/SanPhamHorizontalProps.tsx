import React, { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import GioHangModel from "../model/GioHangModel";
import HinhAnhModel from "../model/HinhAnhModel";
import { layToanBoAnh } from "../api/HinhAnhAPI";
import TextEllipsis from "./componets/text-ellipsis/TextEllipsis";

interface SanPhamHorizontalProps {
	cartItem: GioHangModel;
	type?: any;
	idOrder?: number;
	handleCloseModalOrderDetail?: any;
	statusOrder?: string;
}

export const SanPhamHorizontal: React.FC<SanPhamHorizontalProps> = (props) => {
	// Mở/Đóng modal
	const [openModal, setOpenModal] = React.useState(false);
	const handleOpenModal = () => setOpenModal(true);
	const handleCloseModal = () => setOpenModal(false);

	const [cartItem, setCartItem] = useState<GioHangModel>(props.cartItem);

	const [imageList, setImageList] = useState<HinhAnhModel[]>([]);
	// Lấy ảnh ra từ BE
	useEffect(() => {
		layToanBoAnh(props.cartItem.sanPham.maSanPham)
			.then((response) => {
				setImageList(response);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [props.cartItem.sanPham.maSanPham]);
	// Loading ảnh thumbnail
	let duLieuAnh: string = "";
    if (imageList[0] && imageList[0].duLieuAnh) {
        duLieuAnh = imageList[0].duLieuAnh;
    }
	return (
		<div className='row'>
			<div className='col'>
				<div className='d-flex'>
					<img
						src={duLieuAnh}
						className='card-img-top'
						alt={props.cartItem.sanPham.tenSanPham}
						style={{ width: "100px" }}
					/>
					<div className='d-flex flex-column pb-2'>
						<Tooltip title={props.cartItem.sanPham.tenSanPham} arrow>
							<Link
								to={`/book/${props.cartItem.sanPham.maSanPham}`}
								className='d-inline text-black'
							>
								<TextEllipsis
									text={props.cartItem.sanPham.tenSanPham + " "}
									limit={100}
								/>
							</Link>
						</Tooltip>
						<div className='mt-auto'>
							<span className='discounted-price text-danger'>
								<strong style={{ fontSize: "22px" }}>
									{props.cartItem.sanPham.giaBan.toLocaleString()}đ
								</strong>
							</span>
							<span
								className='original-price ms-3 small'
								style={{ color: "#000" }}
							>
								<del>
									{props.cartItem.sanPham.giaNiemYet.toLocaleString()}đ
								</del>
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className='col-2 text-center'>
				<strong>{props.cartItem.soLuong}</strong>
			</div>
			<div className='col-2 text-center'>
				<span className='text-danger'>
					<strong>
						{(
							props.cartItem.soLuong * props.cartItem.sanPham.giaBan
						).toLocaleString()}
						đ
					</strong>
				</span>
			</div>
			<hr className='mt-3' />
		</div>
	);
};
