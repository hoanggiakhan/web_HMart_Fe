import React, { ChangeEvent, useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material/Select/SelectInput";
import { Icon, NativeSelect, TextField } from "@mui/material";
import { green, red } from "@mui/material/colors";
import ProductTypeModel from "../../model/ProductTypeModel";
import { getAllProductType } from "../../api/ProductTypeApi";


interface ToolFilterProps {
	setSize: any;
	setKeySearch: any;
	setIdProductType: any;
	setFilter: any;
	size: number;
	keySearch: string;
	idProductType: number;
	filter: number;
}

const ToolFilter: React.FC<ToolFilterProps> = (props) => {
	// Xử lý input search (giống bên navbar)
	// let keySearchTemp: string = "";
	const [keySearchTemp, setKeySearchTemp] = useState(props.keySearch);
	// Khi thay đổi value ở ô input thì sẽ tự động cập nhật lại component
	const onSetKeySearch = (e: ChangeEvent<HTMLInputElement>) => {
		setKeySearchTemp(e.target.value);

		if (e.target.value.trim() === "") {
			props.setKeySearch(e.target.value);
		}
	};

	// Khi nhấn vào nút search
	const submitSearch = () => {
		props.setKeySearch(keySearchTemp);
	};

	// Khi nhấn enter thì sẽ submit search
	const handleKeyUp = (event: any) => {
		if (event.key === "Enter") {
			submitSearch();
		}
	};

	// Thay đổi giá trị thể loại
	const handleChangeProductType = (event: SelectChangeEvent) => {
		// if (event.target.value === "") {
		// 	props.setIdGenre(0);
		// } else {
		props.setIdProductType(event.target.value);
		// }
	};

	// Thay đổi giá trị lọc
	const handleChangeFilter = (event: SelectChangeEvent) => {
		// if (event.target.value === "") {
		// 	props.setFilter(0);
		// } else {
		props.setFilter(event.target.value);
		// }
	};

	// Lấy tất cả thể loại ra
	const [producTypes, setProductTypes] = useState<ProductTypeModel[] | null>(null);
	useEffect(() => {
		getAllProductType()
			.then((response) => {
				setProductTypes(response.productTypeList);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	return (
		<div className='d-flex align-items-center justify-content-between'>
			<div className='row' style={{ flex: 1 }}>
				<div className='col-lg-6 col-md-12 col-sm-12'>
					<div className='d-flex align-items-center justify-content-lg-start justify-content-md-center justify-content-sm-center'>
						{/* Genre */}
						<FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
							<InputLabel id='demo-simple-select-helper-label'>
								Danh mục sản phẩm
							</InputLabel>
							<Select
								labelId='demo-simple-select-helper-label'
								id='demo-simple-select-helper'
								value={props.idProductType ? props.idProductType + "" : ""}
								label='Thể loại sách'
								autoWidth
								onChange={handleChangeProductType}
								sx={{ minWidth: "150px" }}
							>
								<MenuItem value=''>
									<em>None</em>
								</MenuItem>
								{producTypes?.map((productType, index) => {
									return (
										<MenuItem value={productType.idProductType} key={index}>
											{productType.nameProductType}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>

						{/* Filter */}
						<FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
							<InputLabel id='demo-simple-select-helper-label'>
								Sắp xếp theo
							</InputLabel>
							<Select
								labelId='demo-simple-select-helper-label'
								id='demo-simple-select-helper'
								value={props.filter ? props.filter + "" : ""}
								label='Sắp xếp theo'
								autoWidth
								onChange={handleChangeFilter}
								sx={{ minWidth: "150px" }}
							>
								<MenuItem value=''>
									<em>None</em>
								</MenuItem>
								<MenuItem value={1}>Tên sản phẩm A - Z</MenuItem>
								<MenuItem value={2}>Tên sản phẩm Z - A</MenuItem>
								<MenuItem value={3}>
									<span className='d-inline-flex align-items-center'>
										Giá tăng dần
										<Icon
											sx={{
												flex: "1",
												color: green[500],
											}}
										>
											trending_up
										</Icon>
									</span>
								</MenuItem>
								<MenuItem value={4}>
									<span className='d-inline-flex align-items-center'>
										Giá giảm dần
										<Icon sx={{ flex: "1", color: red[500] }}>
											trending_down
										</Icon>
									</span>
								</MenuItem>
								<MenuItem value={5}>Sản phẩm bán chạy nhất</MenuItem>
							</Select>
						</FormControl>
					</div>
				</div>

				{/* Search */}
				<div className='col-lg-6 col-md-12 col-sm-12'>
					<div className='d-inline-flex align-items-center justify-content-lg-end w-100 justify-content-md-center'>
						<div className='d-inline-flex align-items-center justify-content-between mx-5'>
							<TextField
								size='small'
								id='outlined-search'
								label='Tìm kiếm theo tên sản phẩm'
								type='search'
								value={keySearchTemp}
								onChange={onSetKeySearch}
								onKeyUp={handleKeyUp}
							/>
							<button
								style={{ height: "40px" }}
								type='button'
								className='btn btn-primary ms-2'
								onClick={() => props.setKeySearch(keySearchTemp)}
							>
								<i className='fas fa-search'></i>
							</button>
						</div>
						{/* Size: Hiện bao nhiêu sản phẩm trên 1 trang */}
						<FormControl>
							<InputLabel
								variant='standard'
								htmlFor='uncontrolled-native'
							>
								Hiện sản phẩm
							</InputLabel>
							<NativeSelect
								defaultValue={props.size}
								onChange={(e) => {
									props.setSize(parseInt(e.target.value));
								}}
							>
								<option value={12}>12 sản phẩm</option>
								<option value={24}>24 sản phẩm</option>
								<option value={48}>48 sản phẩm</option>
							</NativeSelect>
						</FormControl>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ToolFilter;
