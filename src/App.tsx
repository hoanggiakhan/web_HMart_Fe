import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import './App.css';

import { ConfirmProvider } from "material-ui-confirm";
import Footer from './header-footer/Footer';
import { AuthProvider } from './utils/AuthContext';
import { CartItemProvider } from './utils/CartItemContext';
import Navbar from './header-footer/Navbar';
import ProductDetail from './products/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutStatus from './pages/CheckoutStatus';
import { Error403Page } from './pages/components/403Page';
import { Error404Page } from './pages/components/404Page';
import LoginPage from './user/LoginPage';
import RegisterPage from './user/RegisterPage';
import ActiveAccount from './user/ActiveAccount';
import HomePage from './pages/HomePage';
import FilterPage from './pages/FilterPage';
import ProfilePage from './user/ProfilePage';
import { ForgotPassword } from './user/ForgotPassword';
import PolicyPage from './pages/Delivery-Policy';
import PolicyDeliveryPage from './pages/Delivery-Policy';
import About from './about/About';
import { ToastContainer } from 'react-toastify';
import { Slidebar } from './admin/Slidebar';
import DashboardPage from './admin/Dashboard';
import ProductManagementPage from './admin/ProductManagement';
import UserManagementPage from './admin/UserManagement';
import ProductTypeManagementPage from './admin/ProductTypeManagement';
import OrderManagementPage from './admin/OrderManagement';


const MyRoutes = () => {
  const [reloadAvatar, setReloadAvatar] = useState(0);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  return(
    <AuthProvider>
			<CartItemProvider>
				<ConfirmProvider>
					{/* Customer */}
					{!isAdminPath && <Navbar key={reloadAvatar} />}
					<Routes>
						<Route path='/' element={<HomePage />} /> 
						<Route path='/product/:idProduct' element={<ProductDetail />} />
						<Route path='/cart' element={<CartPage />} />
						<Route path='/error-403' element={<Error403Page />} />
						<Route
							path='/check-out/status'
							element={<CheckoutStatus />}
						/>
						<Route path='/login' element={<LoginPage />} />
						<Route path='/register' element={<RegisterPage />} /> 
						<Route
							path='/active/:email/:activationCode'
							element={<ActiveAccount />}
						/>
						<Route
							path='/search/:idProductTypeParam'
							element={<FilterPage />}
						/>
						<Route path='/search' element={<FilterPage />} /> 
						<Route
							path='/profile'
							element={<ProfilePage setReloadAvatar={setReloadAvatar} />}
						/>
						<Route
							path='/info/delivery-policy'
							element={<PolicyDeliveryPage/>}
						/>
						<Route path='/forgot-password' element={<ForgotPassword />} />
						<Route path='/about' element={<About />} />
						{!isAdminPath && (
							<Route path='*' element={<Error404Page />} />
						)}
					</Routes>
					{!isAdminPath && <Footer />}

					{/* Admin */}
					{isAdminPath && (
						<div className='row overflow-hidden w-100'>
							<div className='col-2 col-md-3 col-lg-2'>
								<Slidebar />
							</div>
							<div className='col-10 col-md-9 col-lg-10'>
								<Routes>
									<Route path='/admin' element={<DashboardPage />} />
									<Route
										path='/admin/dashboard'
										element={<DashboardPage />}
									/>
									<Route
										path='/admin/product'
										element={<ProductManagementPage />}
									/>
									<Route
										path='/admin/user'
										element={<UserManagementPage />}
									/>
									<Route
										path='/admin/product-type'
										element={<ProductTypeManagementPage />}
									/>
									<Route
										path='/admin/order'
										element={<OrderManagementPage />}
									/>
									{isAdminPath && (
										<Route path='*' element={<Error404Page />} />
									)}
								</Routes>
							</div>
						</div>
					)}
					<ToastContainer
						position='bottom-center'
						autoClose={3000}
						pauseOnFocusLoss={false}
					/>
					
				</ConfirmProvider>
			</CartItemProvider>
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
