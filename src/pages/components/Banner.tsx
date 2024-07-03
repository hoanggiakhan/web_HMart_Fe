import React from "react";
import "./Banner.css";
import { Link } from "react-router-dom";

function Banner() {
	return (
		<div className='container-fluid pt-5 pb-4 text-dark d-flex justify-content-center align-items-center'>
			<div>
				<h3
					data-text='Chào mừng bạn đến với siêu thị Khanh-mart'
					className='banner-text display-5 fw-bold '
				>
					Chào mừng bạn đến với siêu thị Khanh-mart
				</h3>
				<p className=''>Đặt niềm tin vào sản phẩm - Đặt sự hài lòng lên hàng đầu</p>
				<Link to={"/search"}>
					<button className='btn btn-primary btn-lg text-white float-end'>
						Mua sắm ngay
					</button>
				</Link>
			</div>
		</div>
	);
}

export default Banner;
