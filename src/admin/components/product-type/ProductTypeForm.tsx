/* eslint-disable no-lone-blocks */
import React, { FormEvent, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductTypeModel from "../../../model/ProductTypeModel";
import { get1ProductType } from "../../../api/ProductTypeApi";
import { isTokenExpired } from "../../../utils/JwtService";
import { endpointBE } from "../../../utils/Constant";

interface ProductTypeFormProps {
	option: string;
	id: number;
	handleCloseModal: any;
	setKeyCountReload?: any;
}

export const ProductTypeForm: React.FC<ProductTypeFormProps> = (props) => {
	const [productType, setProductType] = useState<ProductTypeModel>({
		idProductType: 0,
		nameProductType: "",
	});

	// Lấy dữ liệu khi mà update
	useEffect(() => {
		if (props.option === "update") {
			get1ProductType(props.id).then((response) =>
				setProductType({
					idProductType: response.productType.idProductType,
					nameProductType: response.productType.nameProductType,
				})
			);
		}
	}, [props.id, props.option]);

	function hanleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const token = localStorage.getItem("token");

		if (!token) {
			alert("Bạn chưa đăng nhập!");
			return;
		}
		if (!isTokenExpired(token)) {
			alert("Token đã hết hạn. Vui lòng đăng nhập lại!");
			return;
		}

		const method = props.option === "add" ? "POST" : "PUT";
		const endpoint =
			props.option === "add"
				? endpointBE + "/product-type"
				: endpointBE + `/product-type/${props.id}`;

		fetch(endpoint, {
			method: method,
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(productType),
		})
			.then((response) => {
				if (response.ok) {
					setProductType({
						idProductType: 0,
						nameProductType: "",
					});

					props.option === "add"
						? toast.success("Thêm loại sản phẩm thành công")
						: toast.success("Cập nhật loại sản phẩm thành công");

					props.setKeyCountReload(Math.random());
					props.handleCloseModal();
				} else {
					toast.error("Lỗi khi thực hiện hành động");
					props.handleCloseModal();
				}
			})
			.catch((e) => {
				toast.error("Lỗi khi thực hiện hành động");
				props.handleCloseModal();
				console.log(e);
			});
	}
	return (
		<div>
			<Typography className='text-center' variant='h4' component='h2'>
				{props.option === "add"
					? "TẠO LOẠI SẢN PHẨM"
					: props.option === "update"
					? "SỬA LOẠI SẢN PHẨM"
					: "XEM CHI TIẾT"}
			</Typography>
			<hr />
			<div className='container px-5'>
				<form onSubmit={hanleSubmit} className='form'>
					<input type='hidden' id='idProductType' value={productType.idProductType} hidden />
					<Box
						sx={{
							"& .MuiTextField-root": { mb: 3 },
						}}
					>
						<TextField
							required
							id='filled-required'
							label='Tên loại sản phẩm'
							style={{ width: "100%" }}
							value={productType.nameProductType}
							onChange={(e) =>
								setProductType({ ...productType, nameProductType: e.target.value })
							}
							size='small'
						/>
					</Box>
					{props.option !== "view" && (
						<button className='btn btn-primary w-100 my-3' type='submit'>
							{props.option === "add" ? "Tạo loại sản phẩm" : "Lưu loại sản phẩm"}
						</button>
					)}
				</form>
			</div>
		</div>
	);
};
