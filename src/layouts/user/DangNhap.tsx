import React, { useState } from "react";
import { Link } from "react-router-dom";
import useScrollToTop from "../../hooks/ScrollToTop";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "../../admin/RequireAdmin";
import { toast } from "react-toastify";
import GioHangModel from "../../model/GioHangModel";
import { getCartAllByIdUser } from "../../api/GioHangApi";
import { useCartItem } from "../utils/GioHangContext";


const DangNhap = () => {
    useScrollToTop();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
     const {setTongGioHang , setGioHang} = useCartItem();
    const xuLyDangNhap = () => {
        const loginRequest = {
            username: username,
            password: password
        };

        fetch('http://localhost:8080/tai-khoan/dang-nhap',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginRequest)
            }
        ).then(
            (response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Đăng nhập thất bại!')
                }
            }
        ).then(
          async  (data) => {
                // Xử lý đăng nhập thành công
                const { jwt } = data;
                const decodedToken = jwtDecode(jwt) as JwtPayload;

                if(decodedToken.daKichHoat===false){
                    toast.warning(
                        'Tài khoản của bạn chưa được kích hoạt hoặc đã bị vô hiệu hóa'
                    );
                    return;
                }
                toast.success("Đăng nhập thành công");
                // Lưu token vào localStorage hoặc cookie
                localStorage.setItem('token', jwt);
                // Điều hướng đến trang chính hoặc thực hiện các tác vụ sau đăng nhập thành công
                setError('Đăng nhập thành công!');
                const duLieuGioHang : string | null = localStorage.getItem('cart');
                let cart : GioHangModel[] = duLieuGioHang ? JSON.parse(duLieuGioHang) : [];
                if(cart.length!==0){
                    cart=cart.map((c)=>({...c , maNguoiDung : decodedToken.maNguoiDung}));
                     const endpoint = 'http://localhost:8080/gio-hangs/them-san-pham'
                     fetch(endpoint, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${jwt}`,
							"content-type": "application/json",
						},
						body: JSON.stringify(cart),
					})
						.then((response) => {
							// Lấy giỏ hàng của user khi đăng nhâp thành công
							async function getCart() {
								const response = await getCartAllByIdUser();
								// Xoá cart mà lúc chưa đăng nhập
								localStorage.removeItem("cart");
								cart = response;
								// Thêm cart lúc đăng nhập
								localStorage.setItem("cart", JSON.stringify(cart));
								setTongGioHang(cart.length);
								setGioHang(cart);
							}
							getCart();
						})
						.catch((err) => {
							console.log(err);
						});
                }else{
                    // Lấy giỏ hàng của user khi đăng nhâp thành công
					const response = await getCartAllByIdUser();
					// Xoá cart mà lúc chưa đăng nhập
					localStorage.removeItem("cart");
					cart = response;
					// Thêm cart lúc đăng nhập
					localStorage.setItem("cart", JSON.stringify(cart));
					setTongGioHang(cart.length);
					setGioHang(cart);
                }
            }
        ).catch((error) => {
            // Xử lý lỗi đăng nhập
            console.error('Đăng nhập thất bại: ', error);
            setError('Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.');
        }
        )
    }
    return (
        <div className="container bg-light mt-3 mb-3" style={{width :'1000px' , height : '600px'}}>
            <h1 className="text-center text-danger">Khanh-mart</h1>
            <h5 className="text-center">Đăng nhập</h5>
            <section className="vh-100">
                <div className="container-fluid h-custom">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-md-9 col-lg-6 col-xl-5">
                            <img src={'./../../images/public/7.png'}
                                className="img-fluid" alt="Sample image" />
                        </div>
                        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                            <form>
                                <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                                    <p className="lead fw-normal mb-0 me-3">Sign in with</p>
                                    <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-floating mx-1">
                                        <i className="fab fa-facebook-f"></i>
                                    </button>

                                    <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-floating mx-1">
                                        <i className="fab fa-twitter"></i>
                                    </button>

                                    <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-floating mx-1">
                                        <i className="fab fa-linkedin-in"></i>
                                    </button>
                                </div>

                                <div className="divider d-flex align-items-center my-4">
                                    <p className="text-center fw-bold mx-3 mb-0">Or</p>
                                </div>
                                <hr />


                                <div data-mdb-input-init className="form-outline mb-4">
                                <span className="text-danger">*</span>
                                    <input type="username" id="username" className="form-control form-control-lg"
                                      value={username}
                                      onChange={e=>setUsername(e.target.value)}
                                     placeholder="Tên đăng nhập" />
                                </div>


                                <div data-mdb-input-init className="form-outline mb-3">
                                <span className="text-danger">*</span>
                                    <input type="password" id="password" className="form-control form-control-lg"
                                    value={password}
                                    onChange={e=>setPassword(e.target.value)}
                                        placeholder="Mật khẩu" />
                                </div>

                                <div className="d-flex justify-content-between align-items-center">

                                    <div className="form-check mb-0">
                                        <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                                        <label className="form-check-label" form="form2Example3">
                                            Remember me
                                        </label>
                                    </div>
                                    <a href="#!" className="text-body">Forgot password?</a>
                                </div>

                                <div className="text-center text-lg-start mt-4 pt-2">
                                    <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-lg"
                                     onClick={xuLyDangNhap}
                                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>Đăng nhập</button>
                                        {error && <div style={{color : 'green'}}>{error}</div> }
                                    <p className="small fw-bold mt-2 pt-1 mb-0">Bạn chưa có tài khoản? <Link to={'/dang-ky'}
                                        className="link-danger">Đăng ký</Link></p>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        
    );
}
export default DangNhap;