import { DeleteOutlineOutlined } from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useConfirm } from "material-ui-confirm";
import ProductModel from "../../../model/ProductModel";
import { getAllProduct } from "../../../api/ProductApi";
import { getAllImage } from "../../../api/ImageApi";
import { endpointBE } from "../../../utils/Constant";
import { DataTable } from "../../../utils/DataTable";


interface ProductTableProps {
	setOption: any;
	handleOpenModal: any;
	setKeyCountReload?: any;
	keyCountReload?: any;
	setId: any;
}

export const ProductTable: React.FC<ProductTableProps> = (props) => {
	const [loading, setLoading] = useState(true);

	// Tạo các biến của confirm dialog
	const confirm = useConfirm();
	// Tạo biến để lấy tất cả data
	const [data, setData] = useState<ProductModel[]>([]);

	// Hàm để lấy tất cả các sách render ra table
	useEffect(() => {
		const fetchData = async () => {
			try {
				const productResponse = await getAllProduct(1000, 0);

				const promises = productResponse.productList.map(async (product) => {
					const imagesList = await getAllImage(product.idProduct);

					const thumbnail = imagesList.find((image) => image.dataImage);

					return {
						...product,
						id: product.idProduct,
						thumbnail: thumbnail?.urlImage || thumbnail?.dataImage,
					};
				});
				// Promise.all(promises) nghĩa là đợi cho những Promise trên kia hoàn thành hết thì mới tới
				// câu lệnh này
				const products = await Promise.all(promises);
				setData(products);
				setLoading(false);
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
	}, [props.keyCountReload]);

	// Xử lý xoá sách
	const handleDeleteProduct = (id: any) => {
		const token = localStorage.getItem("token");
		confirm({
			title: "Xoá sản phẩm",
			description: `Bạn chắc chắn xoá sản phẩm này chứ?`,
			confirmationText: ["Xoá"],
			cancellationText: ["Huỷ"],
		})
			.then(() => {
				fetch(endpointBE + `/products/${id}`, {
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then((response) => {
						if (response.ok) {
							toast.success("Xoá sản phẩm thành công");
							props.setKeyCountReload(Math.random());
						} else {
							toast.error("Lỗi khi xoá sản phẩm");
						}
					})
					.catch((error) => {
						toast.error("Lỗi khi xoá sản phẩm");
						console.log(error);
					});
			})
			.catch(() => {});
	};

	const columns: GridColDef[] = [
		{ field: "id", headerName: "ID", width: 80 },
		{
			field: "thumbnail",
			headerName: "ẢNH",
			width: 100,
			renderCell: (params) => {
				return <img src={params.value} alt='' width={70} />;
			},
		},
		{ field: "nameProduct", headerName: "TÊN SẢN PHẨM", width: 350 },
		{ field: "quantity", headerName: "SỐ LƯỢNG", width: 100 },
		{
			field: "sellPrice",
			headerName: "GIÁ BÁN",
			width: 120,
			renderCell: (params) => {
				return (
					<span>
						{Number.parseInt(params.value).toLocaleString("vi-vn")}đ
					</span>
				);
			},
		},
		{ field: "author", headerName: "NHÀ CUNG CẤP", width: 150 },

		{
			field: "action",
			headerName: "HÀNH ĐỘNG",
			width: 200,
			type: "actions",
			renderCell: (item) => {
				return (
					<div>
						<Tooltip title={"Chỉnh sửa"}>
							<IconButton
								color='primary'
								onClick={() => {
									props.setOption("update");
									props.setId(item.id);
									props.handleOpenModal();
								}}
							>
								<EditOutlinedIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title={"Xoá"}>
							<IconButton
								color='error'
								onClick={() => handleDeleteProduct(item.id)}
							>
								<DeleteOutlineOutlined />
							</IconButton>
						</Tooltip>
					</div>
				);
			},
		},
	];

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return <DataTable columns={columns} rows={data} />;
};
