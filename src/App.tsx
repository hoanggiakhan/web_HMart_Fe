import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import './App.css';
import { AuthProvider } from './utils/AuthContext';
import { GioHangProvider } from './utils/CartItemContext';
import { ConfirmProvider } from "material-ui-confirm";
import Navbar from './header-footer/NavBar';
import HomePage from './pages/HomePage';
import FilterPage from './pages/Filter';
import LoginPage from './user/Login';
import Footer from './header-footer/Footer';
import ChiTietSanPham from './products/ChiTietSanPham';
import GioHangPage from './pages/GioHangPage';
import CheckoutStatus from './pages/CheckoutStatus';

const MyRoutes = () => {
  const [reloadAvatar, setReloadAvatar] = useState(0);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  return(
    <AuthProvider>
       <GioHangProvider>
         <ConfirmProvider>
            {/** Khách hàng */}
            {!isAdminPath && <Navbar key={reloadAvatar}/>}
            <Routes>
               <Route path='/' element={<HomePage/>}/>
               <Route path='/search/:maLoaiSanPhamParam' element={<FilterPage/>}/>
               <Route path='/search' element={<FilterPage/>}/>
               <Route path='/login' element={<LoginPage />} />
               <Route path='/cart' element={<GioHangPage />} />
               <Route path='/san-pham/:maSanPham' element={<ChiTietSanPham />} />
               <Route
							path='/check-out/status'
							element={<CheckoutStatus />}
						/>
            </Routes>
            {!isAdminPath && <Footer/>}
         </ConfirmProvider>
       </GioHangProvider>
    </AuthProvider>
  );
}

function App ()  {
  return(
  <BrowserRouter>
  <MyRoutes />
</BrowserRouter>
  );
}

export default App;
