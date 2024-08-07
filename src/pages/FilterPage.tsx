/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState } from "react";
import { useParams } from "react-router-dom";
import useScrollToTop from "../hooks/ScrollToTop";
import ToolFilter from "./components/ToolFilter";
import ProductList from "../products/ProductList";


interface FilterPageProps {
	keySearchNav?: string; // key search từ navbar
}

const FilterPage: React.FC<FilterPageProps> = (props) => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

	const [size, setSize] = useState(12); // Hiển thị bao nhiêu sản phẩm
	const [keySearch, setKeySearch] = useState(""); // Từ khoá của sản phẩm
	const [idProductType, setIdProductType] = useState(0); // Thể loại muốn hiển thị
	const [filter, setFilter] = useState(0); // Lọc theo chế độ gì (tên từ A - Z, Z - A, ...)

	if (props.keySearchNav !== undefined && props.keySearchNav !== "") {
		setKeySearch(props.keySearchNav);
	}

	// Lấy value id genre từ url
	const { idProductTypeParam } = useParams();
	var idProductTypeNumber: number = 0;
	try {
		idProductTypeNumber = parseInt(idProductTypeParam + ""); // Có thể nó làm object nên phải + thêm chuỗi rỗng vào
		// Nếu mà id genre mà có thay đổi thì id genre trên param sẽ không có tác dụng
		// Đang bị bug khúc này chưa có idea để xử lý
		if (idProductType !== 0) {
			idProductTypeNumber = 0;
		}

		if (Number.isNaN(idProductTypeNumber)) {
			idProductTypeNumber = 0;
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
					keySearch={keySearch}
					setKeySearch={setKeySearch}
					idProductType={idProductTypeNumber ? idProductTypeNumber : idProductType}
					setIdProductType={setIdProductType}
					filter={filter}
					setFilter={setFilter}
				/>
			</div>
			<ProductList
				paginable={true}
				size={size}
				keySearch={keySearch}
				idProductType={idProductTypeNumber ? idProductTypeNumber  : idProductType}
				filter={filter}
			/>
		</>
	);
};

export default FilterPage;
