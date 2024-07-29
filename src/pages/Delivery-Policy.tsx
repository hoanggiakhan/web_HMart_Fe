import useScrollToTop from "../hooks/ScrollToTop";

const PolicyDeliveryPage: React.FC = () => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

	return (
		<div className="container mt-5">
        <h1 className="text-center">CHÍNH SÁCH VẬN CHUYỂN VÀ GIAO HÀNG H-MART</h1>

        <div className="mt-4">
            <h2>I. QUY ĐỊNH VỀ PHÍ GIAO HÀNG, KHU VỰC GIAO HÀNG, THỜI GIAN NHẬN HÀNG</h2>

            <h3>1. Phí Giao Hàng</h3>
            <ul>
                <li>H-MART miễn phí vận chuyển với các đơn hàng có giá trị từ 300.000đ trở lên và khoảng cách giao hàng trong bán kính 5Km.</li>
                <li>Phí giao hàng được áp dụng 5.000đ/Km đối với các đơn hàng có giá trị dưới 300.000đ.</li>
                <li>Phí giao hàng được áp dụng 5.000đ/Km vượt đối với các đơn hàng có giá trị từ 300.000đ trở lên và khoảng cách giao hàng ngoài bán kính 5Km.</li>
            </ul>

            <h3>2. Khu Vực Giao Hàng</h3>
            <ul>
                <li>Khu vực Hà Nội, Hồ Chí Minh và các tỉnh thành phục vụ giao hàng trong bán kính 7Km (theo địa chỉ Khách hàng).</li>
                <li>Đơn hàng sẽ được giao tới tận nhà của khách hàng, ngoại trừ trường hợp khu vực nhà riêng của khách, khu vực chung cư cao tầng (chỉ phục vụ giao tại chân tòa nhà).</li>
                <li>H-MART phục vụ giao hàng cả Thứ 7, Chủ nhật và ngày Lễ.</li>
                <li>H-MART phục vụ giao hàng theo các tỉnh, thành phố như: Hà Nội, Hồ Chí Minh, An Giang, Bắc Cạn, Bắc Giang, Bạc Liêu, Bình Định, Bình Dương, Bắc Kạn, Cần Thơ, Cao Bằng, Cà Mau, Đà Nẵng, Đồng Tháp, Hà Giang, Hà Nam, Hải Dương, Hải Phòng, Lai Châu, Lạng Sơn, Ninh Bình, Phú Thọ, Quảng Bình, Sơn La, Thái Bình, Thanh Hóa, Thái Nguyên, Tuyển Quang, Vĩnh Long, Yên Bái, Thừa Thiên Huế.</li>
                <li>Khu vực tỉnh miền Đông và Tây Nam Bộ, Hà Nội và Thành phố Hồ Chí Minh: Đồng Nai, Bình Phước, Tây Ninh, Bà Rịa - Vũng Tàu, Bình Dương, Lâm Đồng, Đăk Nông, Đăk Lăk, Khánh Hòa, Phú Yên, Ninh Thuận.</li>
            </ul>

            <h3>3. Thời Gian Giao Hàng</h3>
            <ul>
                <li>Hàng sẽ được giao trong vòng 2 tiếng từ khi đơn hàng được xác nhận thành công. Các đơn hàng xác nhận sau 18:00 trong ngày, khách hàng sẽ nhận hàng trước 12:00 sáng ngày hôm sau.</li>
                <li>Thời gian giao hàng sẽ được H-MART điều chỉnh thay đổi trong trường hợp:</li>
                <ul>
                    <li>Quý khách không cung cấp chi tiết chính xác, đầy đủ địa chỉ giao hàng và thông tin liên lạc trong quá trình đặt hàng.</li>
                    <li>Các trường hợp bất khả kháng: thiên tai, lũ lụt, hỏa hoạn, đình công,... hoặc tuyến đường/ khung giờ cấm, hạn chế theo quy định của pháp luật và/hoặc chỉ đạo của cơ quan có thẩm quyền.</li>
                    <li>Đơn hàng sẽ được giao tới tận nhà của khách hàng, ngoại trừ khu vực văn phòng hoặc khu vực chung cư cao tầng (chỉ phục vụ giao tại chân tòa nhà).</li>
                    <li>Trường hợp không liên lạc được với khách hàng, thời gian sẽ được tính từ thời điểm khách hàng liên hệ được.</li>
                    <li>Trường hợp hợp có phát sinh, H-MART sẽ thông báo cho quý khách hàng để thống nhất lại thời gian giao hàng tối thiểu trước 24h.</li>
                    <li>Hàng hóa của khách hàng sẽ được H-MART hỗ trợ giao tối đa 2 lần.</li>
                    <li>Hàng hóa áp dụng với chuyển đổi hoặc đơn hàng có giá trị từ 10 triệu đồng trở lên chỉ được xác nhận là đơn hàng sau khi khách hàng thanh toán xong giá trị đơn hàng.</li>
                </ul>
            </ul>
        </div>

        <div className="mt-4">
            <h2>II. QUY ĐỊNH KIỂM TRA HÀNG HÓA KHI GIAO HÀNG</h2>
            <ul>
                <li>H-MART sẽ giao hàng nguyên đai, nguyên kiện cho Khách hàng và hỗ trợ việc kiểm tra các yếu tố bên ngoài của gói hàng như:</li>
                <ul>
                    <li>Phiếu giao hàng, tình trạng đóng gói, niêm phong các kiện hàng,... (niêm phong riêng của từng kiện hàng, từng sản phẩm gây ảnh hưởng đến tem niêm phong bao bì sản phẩm...) hay kiểm tra số lượng hàng hóa.</li>
                    <li>Khách hàng khi nhận hàng sẽ ký vào hóa đơn thanh toán đơn hàng và phiếu giao nhận hàng hóa.</li>
                    <li>Hàng hóa không được đồng kiểm chi tiết bên trong, nếu bóp méo, hỏng nguyên vẹn có vấn đề sẽ được hỗ trợ đổi trả hàng.</li>
                    <li>Giao hàng không đúng mặt hàng số lượng hàng hóa mà khách hàng đã đặt.</li>
                </ul>
            </ul>
            <p>Hãy liên hệ ngay tới bộ phận CSKH của H-MART để được hỗ trợ:</p>
            <p>Thông đại chăm sóc khách hàng H-MART Hotline: 0123456789 (Từ 8h - 21h)</p>
            <p>Email: cskh@H-MART.masangroup.com</p>
        </div>

        <div className="mt-4 text-center">
            <h3>CHÂN THÀNH CẢM ƠN QUÝ KHÁCH</h3>
        </div>
    </div>
	);
};
export default PolicyDeliveryPage;
