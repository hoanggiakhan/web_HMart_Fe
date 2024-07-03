import React, { ChangeEvent, useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material/Select/SelectInput";
import { Icon, NativeSelect, TextField } from "@mui/material";
import { green, red } from "@mui/material/colors";
import LoaiSanPhamModel from "../../model/LoaiSanPhamModel";
import { getAllGenres } from "../../api/LoaiSanPhamAPI";


interface ToolFilterProps {
	setSize: any;
	setTuKhoaTimKiem: any;
	setmaLoaiSanPham: any;
	setFilter: any;
	size: number;
	tuKhoaTimKiem: string;
	maLoaiSanPham: number;
	filter: number;
}

const ToolFilter: React.FC<ToolFilterProps> = (props) => {
	// Xử lý input search (giống bên navbar)
	// let keySearchTemp: string = "";
	const [keySearchTemp, setKeySearchTemp] = useState(props.tuKhoaTimKiem);
	// Khi thay đổi value ở ô input thì sẽ tự động cập nhật lại component
	const onSetKeySearch = (e: ChangeEvent<HTMLInputElement>) => {
		setKeySearchTemp(e.target.value);

		if (e.target.value.trim() === "") {
			props.setTuKhoaTimKiem(e.target.value);
		}
	};

	// Khi nhấn vào nút search
	const submitSearch = () => {
		props.setTuKhoaTimKiem(keySearchTemp);
	};

	// Khi nhấn enter thì sẽ submit search
	const handleKeyUp = (event: any) => {
		if (event.key === "Enter") {
			submitSearch();
		}
	};

	// Thay đổi giá trị thể loại
	const handleChangeGenre = (event: SelectChangeEvent) => {
		// if (event.target.value === "") {
		// 	props.setIdGenre(0);
		// } else {
		props.setmaLoaiSanPham(event.target.value);
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
	const [genres, setGenres] = useState<LoaiSanPhamModel[] | null>(null);
	useEffect(() => {
		getAllGenres()
			.then((response) => {
				setGenres(response.loaiSPList);
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
								Loại sản phẩm
							</InputLabel>
							<Select
								labelId='demo-simple-select-helper-label'
								id='demo-simple-select-helper'
								value={props.maLoaiSanPham? props.maLoaiSanPham + "" : ""}
								label='Thể loại sản phẩm'
								autoWidth
								onChange={handleChangeGenre}
								sx={{ minWidth: "150px" }}
							>
								<MenuItem value=''>
									<em>None</em>
								</MenuItem>
								{genres?.map((genre, index) => {
									return (
										<MenuItem value={genre.maLoaiSanPham} key={index}>
											{genre.tenLoaiSanPham}
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
										
									</span>
								</MenuItem>
								<MenuItem value={4}>
									<span className='d-inline-flex align-items-center'>
										Giá giảm dần
										
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
								label='Tìm kiếm'
								type='search'
								value={keySearchTemp}
								onChange={onSetKeySearch}
								onKeyUp={handleKeyUp}
							/>
							<button
								style={{ height: "40px" }}
								type='button'
								className='btn btn-primary ms-2'
								onClick={() => props.setTuKhoaTimKiem(keySearchTemp)}
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
