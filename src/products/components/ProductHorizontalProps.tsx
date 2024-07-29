import React, { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { Button, Chip } from "@mui/material";
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded";
import DoneIcon from "@mui/icons-material/Done";
import { Link } from "react-router-dom";
import CartItemModel from "../../model/CartItemModel";
import ImageModel from "../../model/ImageModel";
import { getAllImage } from "../../api/ImageApi";
import TextEllipsis from "./text-ellipsis/TextEllipsis";

interface ProductHorizontalProps {
	cartItem: CartItemModel;
	type?: any;
	idOrder?: number;
	handleCloseModalOrderDetail?: any;
	statusOrder?: string;
}

export const ProductHorizontal: React.FC<ProductHorizontalProps> = (props) => {
	// Mở/Đóng modal
	const [openModal, setOpenModal] = React.useState(false);
	const handleOpenModal = () => setOpenModal(true);
	const handleCloseModal = () => setOpenModal(false);

	const [cartItem, setCartItem] = useState<CartItemModel>(props.cartItem);

	const [imageList, setImageList] = useState<ImageModel[]>([]);
	// Lấy ảnh ra từ BE
	useEffect(() => {
		getAllImage(props.cartItem.product.idProduct)
			.then((response) => {
				setImageList(response);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [props.cartItem.product.idProduct]);
	// Loading ảnh thumbnail
    let dataImage: string = "";
    if (imageList[0] && imageList[0].dataImage) {
        dataImage = imageList[0].dataImage;
    }
	return (
		<div className='row'>
			<div className='col'>
				<div className='d-flex'>
					<img
						src={dataImage}
						className='card-img-top'
						alt={props.cartItem.product.nameProduct}
						style={{ width: "100px" }}
					/>
					<div className='d-flex flex-column pb-2'>
						<Tooltip title={props.cartItem.product.nameProduct} arrow>
							<Link
								to={`/book/${props.cartItem.product.idProduct}`}
								className='d-inline text-black'
							>
								<TextEllipsis
									text={props.cartItem.product.nameProduct + " "}
									limit={100}
								/>
							</Link>
						</Tooltip>
						<div className='mt-auto'>
							<span className='discounted-price text-danger'>
								<strong style={{ fontSize: "22px" }}>
									{props.cartItem.product.sellPrice.toLocaleString()}đ
								</strong>
							</span>
							<span
								className='original-price ms-3 small'
								style={{ color: "#000" }}
							>
								<del>
									{props.cartItem.product.listPrice.toLocaleString()}đ
								</del>
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className='col-2 text-center'>
				<strong>{props.cartItem.quantity}</strong>
			</div>
			<div className='col-2 text-center'>
				<span className='text-danger'>
					<strong>
						{(
							props.cartItem.quantity * props.cartItem.product.sellPrice
						).toLocaleString()}
						đ
					</strong>
				</span>
			</div>
			<hr className='mt-3' />
		</div>
	);
};
