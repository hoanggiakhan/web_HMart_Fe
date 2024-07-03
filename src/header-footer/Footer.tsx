import React from "react";

function Footer(){
    return(
        <div>
            <div className="bg-danger" style={{height: '3px'}}></div>
            <div className="container my-5">
    <div className="row text-center">
      <div className="col-md-3">
        <img src={'./../../../images/public/2.png'} className="img-fluid mb-2" alt="Safe Product"/>
        <h5>Sản phẩm an toàn</h5>
      </div>
      <div className="col-md-3">
        <img src={'./../../../images/public/3.png'} className="img-fluid mb-2" alt="Quality Commitment"/>
        <h5>Chất lượng cam kết</h5>
      </div>
      <div className="col-md-3">
        <img src={'./../../../images/public/4.png'} className="img-fluid mb-2" alt="Outstanding Service"/>
        <h5>Dịch vụ vượt trội</h5>
      </div>
      <div className="col-md-3">
        <img src={'./../../../images/public/5.png'} className="img-fluid mb-2" alt="Fast Delivery"/>
        <h5>Giao hàng nhanh</h5>
      </div>
    </div>
  </div>
        <footer className="bg-dark text-white py-5 mt-1">
        <div className="container">
            <div className="row">
                <div className="col-md-4">
                    <h5>Thông tin liên hệ</h5>
                    <p>Địa chỉ: Quận Hà Đông, Thành phố Hà Nội</p>
                    <p>Số điện thoại: 0123 456 789</p>
                    <p>Email: khanhmart@gmail.com</p>
                </div>
                <div className="col-md-4">
                    <h5>Chính sách</h5>
                    <ul className="list-unstyled">
                        <li><a href="#" style={{textDecoration :'none'}} className="text-white">Chính sách bảo mật</a></li>
                        <li><a href="#" style={{textDecoration :'none'}} className="text-white">Điều khoản sử dụng</a></li>
                        <li><a href="#" style={{textDecoration :'none'}} className="text-white">Chính sách hoàn trả</a></li>
                    </ul>
                </div>
                <div className="col-md-4">
                    <h5>Theo dõi chúng tôi</h5>
                    <a href="#" className="text-white me-2"><i className="fab fa-facebook"></i></a>
                    <a href="#" className="text-white me-2"><i className="fab fa-twitter"></i></a>
                    <a href="#" className="text-white me-2"><i className="fab fa-instagram"></i></a>
                </div>
            </div>
            <hr className="my-4"/>
            <div className="text-center">
                <p>&copy; 2024 Khanh-Mart. Đặt chất lượng và dịch vụ lên hàng đầu.</p>
            </div>
        </div>
    </footer>
    </div>
    );
}

export default Footer;