import { useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import { get3BestSellerProducts } from "../../../api/ProductApi";
import ProductModel from "../../../model/ProductModel";
import TextEllipsis from "../../../products/components/text-ellipsis/TextEllipsis";
import ImageModel from "../../../model/ImageModel";


const Top3BestSeller = () => {
	// Lấy dữ liệu top 4 sách được mua nhiều nhất
	const [top3BestSeller, setTop3BestSeller] = useState<ProductModel[]>([]);
	
	useEffect(() => {
		get3BestSellerProducts()
			.then((response) => {
				setTop3BestSeller(response);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);
	
	return (
		<table className='table table-striped table-hover'>
			<thead>
				<tr>
					<th scope='col'>ID</th>
					<th scope='col'>ẢNH</th>
					<th scope='col'>TÊN SẢN PHẨM</th>
					<th scope='col'>ĐÃ BÁN</th>
				</tr>
			</thead>
			<tbody>
				{top3BestSeller.map((product) => {
					return (
						<tr key={product.idProduct}>
							<th scope='row'>{product.idProduct}</th>
							<td>
								<Link
									to={`/product/${product.idProduct}`}
									className='d-inline text-black'
								>
									<img src={product.dataImage} alt='' width={30} />
								</Link>
							</td>
							<Tooltip title={product.nameProduct} arrow>
								<td>
									<Link
										to={`/product/${product.idProduct}`}
										className='d-inline text-black'
									>
										<TextEllipsis
											text={product.nameProduct + ""}
											limit={25}
										/>
									</Link>
								</td>
							</Tooltip>
							<td>{product.soldQuantity}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

export default Top3BestSeller;
