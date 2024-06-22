import React, { useState } from 'react';
import './App.css';
import Navbar from './layouts/header-footer/Navbar';
import Footer from './layouts/header-footer/Footer';
import HomePage from './layouts/homepage/HomePage';
import { layToanBoSanPham } from './api/SanPhamAPI';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import About from './layouts/about/About';
import ChiTietSanPham from './layouts/product/ChiTietSanPham';
import DangKyNguoiDung from './layouts/user/DangKyNguoiDung';
import GioHang from './layouts/about/GioHang';
import ThanhToan from './layouts/about/ThanhToan';
import DangNhap from './layouts/user/DangNhap';
import KichHoatTaiKhoan from './layouts/user/KichHoatTaiKhoan';
import Test from './layouts/user/Test';
import SanPhamForm from './admin/SanPhamForm';
import SanPhamModel from './model/SanPhamModel';
import SanPhamForm_Admin from './admin/SanPhamForm';
import Error403 from './error/Error403';
import { AuthProvider } from './layouts/utils/AuthContext';
import { CartItemProvider } from './layouts/utils/GioHangContext';
import { ConfirmProvider } from "material-ui-confirm";
import { Error404Page } from './error/Error404';
import ChiTiet from './layouts/product/ChiTiet';
import BookCartList from './layouts/product/DanhSachSPGioHang';
import CartPage from './layouts/homepage/SPGioHang';


const App = () => {
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
  const [gioHang, setGioHang] = useState<SanPhamModel[]>([]);
  const xuLyThemGioHang = (sanPham: SanPhamModel) => {
    const sanPhamTonTai = gioHang.find((item) => item.maSanPham === sanPham.maSanPham);
    if (sanPhamTonTai) {
      setGioHang(
        gioHang.map((item) =>
          item.maSanPham === sanPham.maSanPham
            ? { ...item, soLuong: (item.soLuong || 0) + 1 }
            : item
        )
      );
    } else {
      setGioHang([...gioHang, { ...sanPham, soLuong: 1 }]);
    }
  }
  const MyRouters = () => {
    const location = useLocation();
    const isAdminPath = location.pathname.startsWith("/admin");
    return (
       <AuthProvider>
        <CartItemProvider>
        <ConfirmProvider>
           {!isAdminPath &&  <div className='fixed-top'>
          <Navbar
            tuKhoaTimKiem={tuKhoaTimKiem} setTuKhoaTimKiem={setTuKhoaTimKiem}
          />
        </div>}
        <div style={{ paddingTop: '57px' }}>
         <Routes>
            <Route path='/' element={<HomePage tuKhoaTimKiem={tuKhoaTimKiem}  />} />
            <Route path='/:maLoaiSanPham' element={<HomePage tuKhoaTimKiem={tuKhoaTimKiem} />} />
            <Route path='/about' element={<About />} />
            <Route path='/san-pham/:maSanPham' element={<ChiTietSanPham/>} />
            <Route path='/dang-ky' element={<DangKyNguoiDung />} />
            <Route path='/gio-hang' element={<GioHang/>} />
            <Route path='/thanh-toan' element={<ThanhToan gioHang={gioHang} />} />
            <Route path='/dang-nhap' element={<DangNhap />} />
            <Route path='/kich-hoat/:email/:maKichHoat' element={<KichHoatTaiKhoan />} />
            <Route path='/test' element={<Test />} />
            <Route path='/bao-loi-403' element={<Error403 />} />
            {!isAdminPath && (
              <Route path='*' element={<Error404Page/>}/>
            )}
         </Routes>
         {!isAdminPath && <Footer />}

         {isAdminPath && (
            <Routes>
              <Route path='/admin/them-san-pham' element={<SanPhamForm_Admin />}/>
            </Routes>
         )
         }
         </div>
        </ConfirmProvider>
        </CartItemProvider>
       </AuthProvider>
    );
  }
  return (

    <div className="app">
      <BrowserRouter>

        {/* <div className='fixed-top'>
          <Navbar
            tuKhoaTimKiem={tuKhoaTimKiem} setTuKhoaTimKiem={setTuKhoaTimKiem}
            gioHang={gioHang}
          />
        </div>
        <div style={{ paddingTop: '57px' }}>
          <Routes>
            <Route path='/' element={<HomePage tuKhoaTimKiem={tuKhoaTimKiem} themVaoGioHang={xuLyThemGioHang} />} />
            <Route path='/:maLoaiSanPham' element={<HomePage tuKhoaTimKiem={tuKhoaTimKiem} themVaoGioHang={xuLyThemGioHang} />} />
            <Route path='/about' element={<About />} />
            <Route path='/san-pham/:maSanPham' element={<ChiTietSanPham themVaoGioHang={xuLyThemGioHang} />} />
            <Route path='/dang-ky' element={<DangKyNguoiDung />} />
            <Route path='/gio-hang' element={<GioHang gioHang={gioHang} setGioHang={setGioHang} />} />
            <Route path='/thanh-toan' element={<ThanhToan gioHang={gioHang} />} />
            <Route path='/dang-nhap' element={<DangNhap />} />
            <Route path='/kich-hoat/:email/:maKichHoat' element={<KichHoatTaiKhoan />} />
            <Route path='/test' element={<Test />} />
            <Route path='/admin/them-san-pham' element={<SanPhamForm_Admin />} />
            <Route path='/bao-loi-403' element={<Error403 />} />
          </Routes>
          <Footer />
        </div> */}
        <MyRouters/>
      </BrowserRouter>
    </div>
  );
}

export default App;
