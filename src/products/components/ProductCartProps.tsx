/* eslint-disable @typescript-eslint/no-redeclare */
import { Skeleton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CartItemModel from "../../model/CartItemModel";
import { useCartItem } from "../../utils/CartItemContext";
import { useConfirm } from "material-ui-confirm";
import ProductModel from "../../model/ProductModel";
import ImageModel from "../../model/ImageModel";
import { isToken } from "../../utils/JwtService";
import { endpointBE } from "../../utils/Constant";
import { getAllImage } from "../../api/ImageApi";
import { toast } from "react-toastify";
import TextEllipsis from "./text-ellipsis/TextEllipsis";
import SelectQuantity from "./select-quantity/SelectQuantity";

interface ProductCartProp {
	cartItem: CartItemModel;
	handleRemoveProduct: any;
}

const ProductCartProps: React.FC<ProductCartProp> = (props) => {
	const { setCartList} = useCartItem();

	const confirm = useConfirm();

	// Tạo các biến
	const [quantity, setQuantity] = useState(
		props.cartItem.product.quantity !== undefined
			? props.cartItem.quantity > props.cartItem.product.quantity
				? props.cartItem.product.quantity
				: props.cartItem.quantity
			: props.cartItem.quantity
	);
	const [imageList, setImageList] = useState<ImageModel[]>([]);
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
				props.handleRemoveProduct(props.cartItem.product.idProduct);
				if (isToken()) {
					const token = localStorage.getItem("token");
					fetch(endpointBE + `/cart-items/${props.cartItem.idCart}`, {
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
		getAllImage(props.cartItem.product.idProduct)
			.then((response) => {
				setImageList(response);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				setErroring(error.message);
			});
	}, [props.cartItem.product.idProduct]);

	// Loading ảnh thumbnail
    let dataImage: string = "";
    if (imageList[0] && imageList[0].dataImage) {
        dataImage = imageList[0].dataImage;
    }

	// Xử lý tăng số lượng
	const add = () => {
		if (quantity) {
			if (
				quantity <
				(props.cartItem.product.quantity ? props.cartItem.product.quantity : 1)
			) {
				setQuantity(quantity + 1);
				handleModifiedQuantity(props.cartItem.product.idProduct, 1);
			} else {
				toast.warning("Số lượng tồn kho không đủ");
			}
		}
	};

	// Xử lý giảm số lượng
	const reduce = () => {
		if (quantity) {
			// Nếu số lượng về không thì xoá sản phẩm đó
			if (quantity - 1 === 0) {
				handleConfirm();
			} else if (quantity > 1) {
				setQuantity(quantity - 1);
				handleModifiedQuantity(props.cartItem.product.idProduct, -1);
			}
		}
	};

	// Xử lý cập nhật lại quantity trong localstorage / database
	function handleModifiedQuantity(idBook: number, quantity: number) {
		const cartData: string | null = localStorage.getItem("cart");
		const cart: CartItemModel[] = cartData ? JSON.parse(cartData) : [];
		// cái isExistBook này sẽ tham chiếu đến cái cart ở trên, nên khi update thì cart nó cũng update theo
		let isExistProduct = cart.find(
			(cartItem) => cartItem.product.idProduct === idBook
		);
		// Thêm 1 sản phẩm vào giỏ hàng
		if (isExistProduct) {
			// nếu có rồi thì sẽ tăng số lượng
			isExistProduct.quantity += quantity;

			// Cập nhật trong db
			if (isToken()) {
				const token = localStorage.getItem("token");
				fetch(endpointBE + `/cart-item/update-item`, {
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"content-type": "application/json",
					},
					body: JSON.stringify({
						idCart: props.cartItem.idCart,
						quantity: isExistProduct.quantity,
					}),
				}).catch((err) => console.log(err));
			}
		}
		// Cập nhật lại
		localStorage.setItem("cart", JSON.stringify(cart));
		setCartList(cart);
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
	return (
		<>
			<div className='col'>
				<div className='d-flex'>
					<Link to={`/product/${props.cartItem.product.idProduct}`}>
						<img
							src={dataImage}
							className='card-img-top'
							alt={props.cartItem.product.nameProduct}
							style={{ width: "100px" }}
						/>
					</Link>
					<div className='d-flex flex-column pb-2'>
						<Link to={`/product/${props.cartItem.product.idProduct}`}>
							<Tooltip title={props.cartItem.product.nameProduct} arrow>
								<span className='d-inline'>
									<TextEllipsis
										text={props.cartItem.product.nameProduct + " "}
										limit={38}
									/>
								</span>
							</Tooltip>
						</Link>
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
			<div className='col-3 text-center my-auto d-flex align-items-center justify-content-center'>
				<SelectQuantity
					max={props.cartItem.product.quantity}
					setQuantity={setQuantity}
					quantity={quantity}
					add={add}
					reduce={reduce}
					product={props.cartItem.product}
				/>
			</div>
			<div className='col-2 text-center my-auto'>
				<span className='text-danger'>
					<strong>
						{(quantity * props.cartItem.product.sellPrice).toLocaleString()}đ
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
						<DeleteOutlineOutlinedIcon sx={{ cursor: "pointer" }} />
					</button>
				</Tooltip>
			</div>
			<hr className='my-3' />
		</>
	);
};

export default ProductCartProps;
