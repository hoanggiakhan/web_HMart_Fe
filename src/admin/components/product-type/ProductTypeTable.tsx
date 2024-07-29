import { DeleteOutlineOutlined } from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useConfirm } from "material-ui-confirm";
import ProductTypeModel from "../../../model/ProductTypeModel";
import { getAllProductType } from "../../../api/ProductTypeApi";
import { endpointBE } from "../../../utils/Constant";
import { DataTable } from "../../../utils/DataTable";


interface ProductTypeTableProps {
	setOption: any;
	handleOpenModal: any;
	setId: any;
	setKeyCountReload?: any;
	keyCountReload?: any;
}

export const ProductTypeTable: React.FC<ProductTypeTableProps> = (props) => {
	const [loading, setLoading] = useState(true);
	// Tạo các biến của confirm dialog
	const confirm = useConfirm();

	// Tạo biến để lấy tất cả data
	const [data, setData] = useState<ProductTypeModel[]>([]);
	useEffect(() => {
		getAllProductType().then((response) => {
			const productTypes = response.productTypeList.map((productType) => ({
				...productType,
				id: productType.idProductType,
			}));
			setData(productTypes);
			setLoading(false);
		});
	}, [props.keyCountReload]);

	const handleDeleteGenre = (id: any) => {
		const token = localStorage.getItem("token");

		confirm({
			title: "Xoá loại sản phẩm",
			description: `Bạn chắc chắn xoá loại sản phẩm này chứ?`,
			confirmationText: ["Xoá"],
			cancellationText: ["Huỷ"],
		})
			.then(() => {
				fetch(endpointBE + `/product-type/${id}`, {
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then((response) => {
						if (response.ok) {
							toast.success("Xoá loại sản phẩm thành công");
							props.setKeyCountReload(Math.random());
						} else {
							toast.error("Lỗi khi xoá loại sản phẩm");
						}
					})
					.catch((error) => {
						toast.error("Lỗi khi xoá loại sản phẩm");
						console.log(error);
					});
			})
			.catch(() => {});
	};

	const columns: GridColDef[] = [
		{ field: "id", headerName: "ID", width: 150 },
		{ field: "nameProductType", headerName: "TÊN LOẠI SẢN PHẨM", width: 300 },
		{
			field: "action",
			headerName: "HÀNH ĐỘNG",
			width: 300,
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
								onClick={() => handleDeleteGenre(item.id)}
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
