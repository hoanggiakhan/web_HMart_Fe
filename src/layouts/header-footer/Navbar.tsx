import React, { ChangeEvent, useState } from "react";
import { Search } from "react-bootstrap-icons";
import { Link, NavLink } from "react-router-dom";
import './navbar.css';
import SanPhamModel from "../../model/SanPhamModel";
import { useCartItem } from "../utils/GioHangContext";
interface NavbarProps{
   tuKhoaTimKiem : string;
   setTuKhoaTimKiem : (tuKhoa : string) => void;
  
}
function Navbar({ tuKhoaTimKiem,setTuKhoaTimKiem} : NavbarProps){
  const {tongGioHang , setTongGioHang , setGioHang} =useCartItem();
  const[tuKhoaTamThoi,setTuKhoaTamThoi]=useState('')
   const timKiemInput =(e:ChangeEvent<HTMLInputElement>)=>{
       setTuKhoaTamThoi(e.target.value);
   }
   const xuLyTimKiem=()=>{
      setTuKhoaTimKiem(tuKhoaTamThoi);
   }
   const xuLyGioHang =()=>{
      
   }
    return(
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger header">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Khanh-mart</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link active" aria-current="page"to="/">Trang chủ</NavLink>
            </li>
            {/* <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown1" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Danh mục sản phẩm
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown1">
                <li><a className="dropdown-item" href="/1">sữa các loại</a></li>
                <li><a className="dropdown-item" href="/2">rau củ ,trái cây</a></li>
                <li><a className="dropdown-item" href="/3">hóa mỹ phẩm</a></li>
              </ul>
            </li> */}
            <li className="nav-item dropdown">
              <NavLink className="nav-link dropdown-toggle" to="#" id="navbarDropdown1" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Danh mục sản phẩm
              </NavLink>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown1">
                <li><NavLink className="dropdown-item" to="/1">Sữa các loại</NavLink></li>
                <li><NavLink className="dropdown-item" to="/2">Rau củ,trái cây</NavLink></li>
                <li><NavLink className="dropdown-item" to="/3">Hóa mỹ phẩm</NavLink></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown2" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Quy định bán hàng
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown2">
                <li><a className="dropdown-item" href="#">Quy định 1</a></li>
                <li><a className="dropdown-item" href="#">Quy định 2</a></li>
                <li><a className="dropdown-item" href="#">Quy định 3</a></li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Liên hệ</a>
            </li>
          </ul>
        </div>

        {/* Tìm kiếm */}
        <div className="d-flex">
          <input className="form-control me-2" type="search" placeholder="Tìm kiếm" aria-label="Search" onChange={timKiemInput} value={tuKhoaTamThoi} />
          <button className="btn btn-outline-white" type="button" onClick={xuLyTimKiem}>
            <Search className="text-white"/>
          </button>
        </div>

        {/* Biểu tượng giỏ hàng */}
        <ul className="navbar-nav me-1">
          <li className="nav-item">
            
            <Link className="nav-link cart" to={'/gio-hang'}>
              <i className="fas fa-shopping-cart" aria-hidden='true'></i>
              <span className='badge rounded-pill badge-notification bg-danger'>
							{tongGioHang ? tongGioHang : ""}
						</span>
            </Link>
            
          </li>
        </ul>

        {/* Biểu tượng đăng nhập */}
        <ul className="navbar-nav me-1">
          <li className="nav-item">
            <Link  className="nav-link" to={'dang-nhap'}>
              <i className="fas fa-user"></i>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
    );
}
export default Navbar;