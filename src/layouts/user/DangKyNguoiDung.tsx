import React, { useState } from "react";
function DangKyNguoiDung() {

    const [tenDangNhap, setTenDangNhap] = useState("");
    const [email, setEmail] = useState("");
    const [hoDem, setHoDen] = useState("");
    const [ten, setTen] = useState("");
    const [soDienThoai, setSoDienThoai] = useState("");
    const [matKhau, setMatKhau] = useState("");
    const [matKhauLapLai, setMatKhauLapLai] = useState("");
    const [gioiTinh, setGioiTinh] = useState('M');


    // Các biến báo lỗi
    const [errorTenDangNhap, setErrorTenDangNhap] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorMatKhau, setErrorMatKhau] = useState("");
    const [errorMatKhauLapLai, setErrorMatKhauLapLai] = useState("");
    const [thongBao, setThongBao] = useState("");

    // Xử lý thông tin
    const handleSubmit = async (e: React.FormEvent) => {
        // Clear any previous error messages
        setErrorTenDangNhap('');
        setErrorEmail('');
        setErrorMatKhau('');
        setErrorMatKhauLapLai('');

        // Tránh click liên tục
        e.preventDefault();

        // Kiểm tra các điều kiện và gán kết quả vào biến
        const isTenDangNhapValid = !await kiemTraTenDangNhapDaTonTai(tenDangNhap);
        const isEmailValid = !await kiemTraEmailDaTonTai(email);
        const isMatKhauValid = !kiemTraMatKhau(matKhau);
        const isMatKhauLapLaiValid = !kiemTraMatKhauLapLai(matKhauLapLai);

        // Kiểm tra tất cả các điều kiện
        if (isTenDangNhapValid && isEmailValid && isMatKhauValid && isMatKhauLapLaiValid) {
            try {
                const url = 'http://localhost:8080/tai-khoan/dang-ky';

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        tenDangNhap: tenDangNhap,
                        email: email,
                        matKhau: matKhau,
                        hoDem: hoDem,
                        ten: ten,
                        soDienThoai: soDienThoai,
                        gioiTinh: gioiTinh
                    })
                }
                );

                if (response.ok) {
                    setThongBao("Đăng ký thành công, vui lòng kiểm tra email để kích hoạt!");
                } else {
                    console.log(response.json());
                    setThongBao("Đã xảy ra lỗi trong quá trình đăng ký tài khoản.")
                }
            } catch (error) {
                setThongBao("Đã xảy ra lỗi trong quá trình đăng ký tài khoản.")
            }
        }
    }


    // KIỂM TRA TÊN ĐĂNG NHẬP ////////////////////////////////////////////////
    const kiemTraTenDangNhapDaTonTai = async (tenDangNhap: string) => {
        // end-point
        const url = `http://localhost:8080/nguoi-dung/search/existsByTenDangNhap?tenDangNhap=${tenDangNhap}`;
        console.log(url);
        // call api
        try {
            const response = await fetch(url);
            const data = await response.text();
            if (data === "true") {
                setErrorTenDangNhap("Tên đăng nhập đã tồn tại!");
                return true;
            }
            return false;
        } catch (error) {
            console.error("Lỗi khi kiểm tra tên đăng nhập:", error);
            return false; // Xảy ra lỗi
        }
    }

    const handleTenDangNhapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Thay đổi giá trị
        setTenDangNhap(e.target.value);
        // Kiểm tra
        setErrorTenDangNhap('');
        // Kiểm tra sự tồn tại
        return kiemTraTenDangNhapDaTonTai(e.target.value);
    }

    ///////////////////////////////////////////////////////////////////////////////


    // KIỂM TRA TÊN ĐĂNG NHẬP ////////////////////////////////////////////////
    const kiemTraEmailDaTonTai = async (email: string) => {
        // end-point
        const url = `http://localhost:8080/nguoi-dung/search/existsByEmail?email=${email}`;
        console.log(url);
        // call api
        try {
            const response = await fetch(url);
            const data = await response.text();
            if (data === "true") {
                setErrorEmail("Email đã tồn tại!");
                return true;
            }
            return false;
        } catch (error) {
            console.error("Lỗi khi kiểm tra email:", error);
            return false; // Xảy ra lỗi
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Thay đổi giá trị
        setEmail(e.target.value);
        // Kiểm tra
        setErrorEmail('');
        // Kiểm tra sự tồn tại
        return kiemTraEmailDaTonTai(e.target.value);
    }

    ///////////////////////////////////////////////////////////////////////////////

    // KIỂM TRA MẬT KHẨU ////////////////////////////////////////////////
    const kiemTraMatKhau = (matKhau: string) => {
        const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!passwordRegex.test(matKhau)) {
            setErrorMatKhau("Mật khẩu phải có ít nhất 8 ký tự và bao gồm ít nhất 1 ký tự đặc biệt (!@#$%^&*)");
            return true;
        } else {
            setErrorMatKhau(""); // Mật khẩu hợp lệ
            return false;
        }
    }

    const handleMatKhauChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Thay đổi giá trị
        setMatKhau(e.target.value);
        // Kiểm tra
        setErrorMatKhau('');
        // Kiểm tra sự tồn tại
        return kiemTraMatKhau(e.target.value);
    }

    ///////////////////////////////////////////////////////////////////////////////

    // KIỂM TRA MẬT KHẨU LẶP LẠI ////////////////////////////////////////////////
    const kiemTraMatKhauLapLai = (matKhauLapLai: string) => {
        if (matKhauLapLai !== matKhau) {
            setErrorMatKhauLapLai("Mật khẩu không trùng khớp.");
            return true;
        } else {
            setErrorMatKhauLapLai(""); // Mật khẩu trùng khớp
            return false;
        }
    }

    const handleMatKhauLapLaiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Thay đổi giá trị
        setMatKhauLapLai(e.target.value);
        // Kiểm tra
        setErrorMatKhauLapLai('');
        // Kiểm tra sự tồn tại
        return kiemTraMatKhauLapLai(e.target.value);
    }

    ///////////////////////////////////////////////////////////////////////////////
 const xuLyReset =()=>{
    setEmail('');
    setTen('');
    setTenDangNhap('');
    setEmail('');
    setSoDienThoai('');
    setMatKhau('');
    setMatKhauLapLai('');
    setHoDen('');
    setThongBao('');
 }
    return (
        <div className="vh-50" style={{ backgroundColor: '#eee' }}>
            <div className="container h-100 ">
                <div className="row d-flex justify-content-center align-items-center h-100 ">
                    <div className="col-lg-12 col-xl-11 ">
                        <div className="card text-black " style={{ borderRadius: '25px' }}>
                            <div className="card-body p-md-5">
                                <div className="row justify-content-center">
                                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Đăng ký</p>
                                        <form onSubmit={handleSubmit} className="form">
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                                                <div data-mdb-input-init className="form-outline flex-fill mb-0">
                                                <span className="text-danger">*</span>
                                                    <input
                                                        type="text"
                                                        id="tenDangNhap"
                                                        className="form-control"
                                                        placeholder="Tên đăng nhập"
                                                        value={tenDangNhap}
                                                        onChange={handleTenDangNhapChange}
                                                    />
                                                    <div style={{ color: 'red' }}>{errorTenDangNhap}</div>
                                                    {/* <label className="form-label" form="form3Example1c">Tên đăng nhập</label> */}
                                                </div>
                                            </div>
                                                
                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                                <div data-mdb-input-init className="form-outline flex-fill mb-0">
                                                <span className="text-danger">*</span>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        className="form-control"
                                                        placeholder="Email"
                                                        value={email}
                                                        onChange={handleEmailChange}
                                                    />
                                                    <div style={{ color: 'red' }}>{errorEmail}</div>
                                                    {/* <label className="form-label" form="form3Example3c">Email</label> */}
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                                                <div data-mdb-input-init className="form-outline flex-fill mb-0">
                                                    <span className="text-danger">*</span>
                                                    <input
                                                        type="password"
                                                        id="matKhau"
                                                        className="form-control"
                                                        placeholder="Mật khẩu"
                                                        value={matKhau}
                                                        onChange={handleMatKhauChange}
                                                    />
                                                    <div style={{ color: 'red' }}>{errorMatKhau}</div>
                                                    {/* <label className="form-label" form="form3Example4c">Mật khẩu</label> */}
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                                                <div data-mdb-input-init className="form-outline flex-fill mb-0">
                                                <span className="text-danger">*</span>
                                                    <input
                                                        type="password"
                                                        id="matKhauNhapLai"
                                                        className="form-control"
                                                        placeholder="Nhập lại mật khẩu"
                                                        value={matKhauLapLai}
                                                        onChange={handleMatKhauLapLaiChange}
                                                    />
                                                    <div style={{ color: 'red' }}>{errorMatKhauLapLai}</div>
                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-signature fa-lg me-3 fa-fw"></i>
                                                <div data-mdb-input-init className="form-outline flex-fill mb-0">
                                                <span className="text-danger">*</span>
                                                    <input
                                                        type="text"
                                                        id="hoDem"
                                                        className="form-control"
                                                        placeholder="Họ đệm"
                                                        value={hoDem}
                                                        onChange={e => setHoDen(e.target.value)}
                                                    />

                                                </div>
                                            </div>

                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-sharp  fa-signature fa-thin fa-lg me-3 fa-fw"></i>
                                                <div data-mdb-input-init className="form-outline flex-fill mb-0">
                                                <span className="text-danger">*</span>
                                                    <input
                                                        type="text"
                                                        id="ten"
                                                        className="form-control"
                                                        placeholder="Nhập tên"
                                                        value={ten}
                                                        onChange={e => setTen(e.target.value)}
                                                    />

                                                </div>
                                            </div>



                                            <div className="d-flex flex-row align-items-center mb-4">
                                                <i className="fas fa-phone fa-lg me-3 fa-fw"></i>
                                                <div data-mdb-input-init className="form-outline flex-fill mb-0">
                                                <span className="text-danger">*</span>
                                                    <input
                                                        type="text"
                                                        id="soDienThoai"
                                                        className="form-control"
                                                        placeholder="Nhập số điện thoại"
                                                        value={soDienThoai}
                                                        onChange={e => setSoDienThoai(e.target.value)}
                                                    />

                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-4">
                                                    <label htmlFor="">Giới tính</label>
                                                </div>
                                                <div className="col-6">
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="M" />
                                                        <label className="form-check-label" form="inlineRadio1">Nam</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="F" />
                                                        <label className="form-check-label" form="inlineRadio2">Nữ</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-check d-flex justify-content-center mb-5">
                                                <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3c" />
                                                <label className="form-check-label" form="form2Example3">
                                                    I agree all statements in <a href="#!">Terms of service</a>
                                                </label>
                                            </div>
                                            {/* <div className="text-center">
                                                <button type="submit" className="btn btn-primary">Đăng Ký</button>
                                                <div style={{ color: "green" }}>{thongBao}</div>

                                            </div> */}
                                            <div className="text-center">
                                                <button type="button"  className="btn btn-light btn-lg" onClick={xuLyReset}>Reset all</button>
                                                <button type="submit"  className="btn btn-warning btn-lg ms-2">Đăng ký</button>

                                            </div>
                                            <div style={{ color: "green" }}>{thongBao}</div>
                                        </form>
                                    </div>
                                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">

                                        <img src={'./../../images/public/10.png'}
                                            className="img-fluid" alt="Sample image" />

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default DangKyNguoiDung;