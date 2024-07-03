/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "../products/SanPham.css";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import {  Skeleton } from "@mui/material";
import SanPhamModel from "../model/SanPhamModel";
import { getAllProduct, laySanPhamTheoMaSanPham, searchProduct } from "../api/SanPhamApi";
import SanPhamProps from "./SanPhamProps";
import Pagination from "../utils/Pagination";
import useScrollToTop from "../hooks/ScrollToTop";

interface SanPhamListProps {
	paginable?: boolean;
	size?: number;
	tuKhoaTimKiem?: string | undefined;
	maLoaiSanPham? : number | undefined ;
	filter?: number;
}

const SanPhamLienQuan: React.FC<SanPhamListProps> = (props) => {
    useScrollToTop()
	const [sanPhamList, setSanPhamList] = useState<SanPhamModel[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [erroring, setErroring] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	// const [totalBook, setTotalBook] = useState(0);

	// Xử lý phân trang
	const handlePagination = (pageNumber: number) => {
		setCurrentPage(pageNumber);
		window.scrollTo(0, 0);
	};

	// Chỗ này xử lý khi thực hiện chức năng hiện số sản phẩm
	const [totalPagesTemp, setTotalPagesTemp] = useState(totalPages);
	if (totalPagesTemp !== totalPages) {
		setCurrentPage(1);
		setTotalPagesTemp(totalPages);
	}

	useEffect(() => {
		// Mặc đinh sẽ gọi getAllBook
		if 
			(props.maLoaiSanPham!==0
		) {
			// currentPage - 1 vì trong endpoint trang đầu tiên sẽ là 0
			laySanPhamTheoMaSanPham(props.maLoaiSanPham) // size là (tổng sản phẩm được hiện)
				.then((response) => {
					setSanPhamList(response.sanPhamList);
					setTotalPages(response.tongTrang);
					setLoading(false);
				})
				.catch((error) => {
					setLoading(false);
					setErroring(error.message);
				});
		} 
	}, [currentPage, props.maLoaiSanPham, props.filter, props.size]);

	if (loading) {
		return (
			<div className='container-book container mb-5 py-5 px-5 bg-light'>
				<div className='row'>
					<div className='col-md-6 col-lg-3 mt-3'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
					<div className='col-md-6 col-lg-3 mt-3'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
					<div className='col-md-6 col-lg-3 mt-3'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
					<div className='col-md-6 col-lg-3 mt-3'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
				</div>
			</div>
		);
	}

	if (erroring) {
		return (
			<div>
				<h1>Gặp lỗi: {erroring}</h1>
			</div>
		);
	}

	// Kiểm tra danh sách sách xem có phần tử nào không
	if (sanPhamList.length === 0) {
		return (
			<div className='container-book container mb-5 px-5 px-5 bg-light'>
				<h2 className='mt-4 px-3 py-3 mb-0'>
					Không tìm thấy sản phẩm! "{props.tuKhoaTimKiem}"
				</h2>
			</div>
		);
	}

	return (
		<div className='container-book container mb-5 pb-5 px-5 bg-light'>
			
			<div className='row'>
				{sanPhamList.map((sanPham) => (
					<SanPhamProps key={sanPham.maSanPham} sanPham={sanPham} />
				))}
			</div>
			{props.paginable ? (
				<>
					<hr className='mt-5' style={{ color: "#aaa" }} />
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						handlePagination={handlePagination}
					/>
				</>
			) : ''}
		</div>
	);
};

export default SanPhamLienQuan;
