/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import {
	getAvatarByToken,
	getLastNameByToken,
	getRoleByToken,
	isToken,
	logout,
} from "../utils/JwtService";
import { Avatar, Button } from "@mui/material";
import { useAuth } from "../utils/AuthContext";
import { useCartItem } from "../utils/CartItemContext";
import ProductTypeModel from "../model/ProductTypeModel";
import { getAllProductType } from "../api/ProductTypeApi";
import { AdminEnpoint } from "../admin/AdminEnpoint";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = (props) => {
	const { totalCart, setTotalCart, setCartList } = useCartItem();
	const { setLoggedIn } = useAuth();
	const navigate = useNavigate();

	// Lấy tất cả thể loại
	const [productTypeList, setProductTypeList] = useState<ProductTypeModel[]>([]);
	const [baoLoi, setBaoLoi] = useState(null);

	useEffect(() => {
		getAllProductType()
			.then((response) => {
				setProductTypeList(response.productTypeList);
			})
			.catch((error) => {
				setBaoLoi(error.message);
			});
	}, []);

	if (baoLoi) {
		console.error(baoLoi);
	}

	const location = useLocation();
	const adminEnpoint = AdminEnpoint; // Thêm các path bạn muốn ẩn Navbar vào đây

	if (adminEnpoint.includes(location.pathname)) {
		return null; // Nếu location.pathname nằm trong danh sách ẩn, trả về null để ẩn Navbar
	}

	return (
		<nav
			className='navbar navbar-expand-lg navbar-light bg-success sticky-top'
			style={{ zIndex: 2 }}
		>
			{/* <!-- Container wrapper --> */}
			<div className='container-fluid'>
				{/* <!-- Toggle button --> */}
				<button
					className='navbar-toggler'
					type='button'
					data-mdb-toggle='collapse'
					data-mdb-target='#navbarSupportedContent'
					aria-controls='navbarSupportedContent'
					aria-expanded='false'
					aria-label='Toggle navigation'
				>
					<i className='fas fa-bars'></i>
				</button>
				{/* <!-- Collapsible wrapper --> */}
				<div
					className='collapse navbar-collapse'
					id='navbarSupportedContent'
				>
					{/* <!-- Navbar brand --> */}
					<Link className='navbar-brand mt-2 mt-lg-0' to='/'>
						<h5>H-Mart</h5>
					</Link>
					{/* <!-- Left links --> */}
					<ul className='navbar-nav me-auto mb-2 mb-lg-0'>
						<li className='nav-item'>
							<NavLink className='nav-link' to='/'>
								Trang chủ
							</NavLink>
						</li>
                        <li className='nav-item dropdown dropdown-hover text-dark'>
							<a
								className='nav-link dropdown-toggle'
								href='#'
								role='button'
								data-bs-toggle='dropdown'
								aria-expanded='false'
							>
								Loại Sản Phẩm
							</a>
							<ul className='dropdown-menu'>
								{productTypeList.map((productType, index) => {
									return (
										<li key={index}>
											<Link
												className='dropdown-item'
												to={`/search/${productType.idProductType}`}
											>
												{productType.nameProductType}
											</Link>
										</li>
									);
								})}
							</ul>
						</li>
						
						<li className='nav-item'>
							<NavLink className='nav-link' to='/search'>
								Kho sản phẩm
							</NavLink>
						</li>
						<li className='nav-item'>
							<NavLink className='nav-link' to='/about'>
								Giới thiệu
							</NavLink>
						</li>
					</ul>
					{/* <!-- Left links --> */}
				</div>
				{/* <!-- Collapsible wrapper --> */}
				{/* <!-- Right elements --> */}
				<div className='d-flex align-items-center'>
					{/* <!-- Shopping Cart --> */}
					<Link className='text-reset me-3' to='/cart'>
						<i className='fas fa-shopping-cart'></i>
						<span className='badge rounded-pill badge-notification bg-danger'>
							{totalCart ? totalCart : ""}
						</span>
					</Link>
					{!isToken() && (
						<div>
							<Link to={"/login"} >
								<Button className="text-danger">Đăng nhập</Button>
							</Link>
							<Link to={"/register"} >
								<Button className="text-danger">Đăng ký</Button>
							</Link>
						</div>
					)}

					{isToken() && (
						<>
							{/* <!-- Notifications --> */}
							<div className='dropdown'>
								<a
									className='text-reset me-3 dropdown-toggle hidden-arrow'
									href='#'
									id='navbarDropdownMenuLink'
									role='button'
									data-mdb-toggle='dropdown'
									aria-expanded='false'
								>
									<i className='fas fa-bell'></i>
									<span className='badge rounded-pill badge-notification bg-danger'>
										1
									</span>
								</a>
								<ul
									className='dropdown-menu dropdown-menu-end'
									aria-labelledby='navbarDropdownMenuLink'
								>
									<li>
										<a className='dropdown-item' href='#'>
											Some news
										</a>
									</li>
									<li>
										<a className='dropdown-item' href='#'>
											Another news
										</a>
									</li>
									<li>
										<a className='dropdown-item' href='#'>
											Something else here
										</a>
									</li>
								</ul>
							</div>
							{/* <!-- Avatar --> */}
							<div className='dropdown'>
								<a
									className='dropdown-toggle d-flex align-items-center hidden-arrow'
									href='#'
									id='navbarDropdownMenuAvatar'
									role='button'
									data-mdb-toggle='dropdown'
									aria-expanded='false'
								>
									<Avatar
										style={{ fontSize: "14px" }}
										alt={getLastNameByToken()?.toUpperCase()}
										src={getAvatarByToken()}
										sx={{ width: 30, height: 30 }}
									/>
								</a>
								<ul
									className='dropdown-menu dropdown-menu-end'
									aria-labelledby='navbarDropdownMenuAvatar'
								>
									<li>
										<Link to={"/profile"} className='dropdown-item'>
											Thông tin cá nhân
										</Link>
									</li>
									
									{getRoleByToken() === "ADMIN" && (
										<li>
											<Link
												className='dropdown-item'
												to='/admin/dashboard'
											>
												Quản lý
											</Link>
										</li>
									)}
									<li>
										<a
											className='dropdown-item'
											style={{ cursor: "pointer" }}
											onClick={() => {
												setTotalCart(0);
												logout(navigate);
												setLoggedIn(false);
												setCartList([]);
											}}
										>
											Đăng xuất
										</a>
									</li>
								</ul>
							</div>
						</>
					)}
				</div>
				{/* <!-- Right elements --> */}
			</div>
			{/* <!-- Container wrapper --> */}
		</nav>
	);
};

export default Navbar;