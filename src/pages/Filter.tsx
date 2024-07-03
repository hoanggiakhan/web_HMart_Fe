/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import useScrollToTop from "../hooks/ScrollToTop";
import { useParams } from "react-router-dom";
import ToolFilter from "./components/ToolFilter";
import SanPhamList from "../products/SanPhamList";

interface FilterPageProps {
	tuKhoaTimKiemNav?: string; // key search từ navbar
}

const FilterPage: React.FC<FilterPageProps> = (props) => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

	const [size, setSize] = useState(12); // Hiển thị bao nhiêu sản phẩm
	const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState(""); // Từ khoá của sách
	const [maLoaiSanPham, setMaLoaiSanPham] = useState(0); // Thể loại muốn hiển thị
	const [filter, setFilter] = useState(0); // Lọc theo chế độ gì (tên từ A - Z, Z - A, ...)

	if (props.tuKhoaTimKiemNav !== undefined && props.tuKhoaTimKiemNav !== "") {
		setTuKhoaTimKiem(props.tuKhoaTimKiemNav);
	}

	// Lấy value id genre từ url
	const { maLoaiSanPhamParam } = useParams();
	var idGenreNumber: number = 0;
	try {
		idGenreNumber = parseInt(maLoaiSanPhamParam + ""); // Có thể nó làm object nên phải + thêm chuỗi rỗng vào
		// Nếu mà id genre mà có thay đổi thì id genre trên param sẽ không có tác dụng
		// Đang bị bug khúc này chưa có idea để xử lý
		if (maLoaiSanPham !== 0) {
			idGenreNumber = 0;
		}

		if (Number.isNaN(idGenreNumber)) {
			idGenreNumber = 0;
		}
	} catch (error) {
		console.error("Error: ", error);
	}

	return (
		<>
			<div className='container-book container bg-light my-3 py-3 px-5'>
				<ToolFilter
					size={size}
					setSize={setSize}
					tuKhoaTimKiem={tuKhoaTimKiem}
					setTuKhoaTimKiem={setTuKhoaTimKiem}
					maLoaiSanPham={idGenreNumber ? idGenreNumber : maLoaiSanPham}
					setmaLoaiSanPham={setMaLoaiSanPham}
					filter={filter}
					setFilter={setFilter}
				/>
			</div>
			<SanPhamList
				paginable={true}
				size={size}
				tuKhoaTimKiem={tuKhoaTimKiem}
				maLoaiSanPham={idGenreNumber ? idGenreNumber : maLoaiSanPham}
				filter={filter}
			/>
		</>
	);
};

export default FilterPage;
