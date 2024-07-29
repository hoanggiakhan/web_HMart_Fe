/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useScrollToTop from "../hooks/ScrollToTop";
import { useCartItem } from "../utils/CartItemContext";
import ProductModel from "../model/ProductModel";
import { getProductById } from "../api/ProductApi";
import ProductTypeModel from "../model/ProductTypeModel";
import { getProductTypeByIdProduct } from "../api/ProductTypeApi";
import ImageModel from "../model/ImageModel";
import { getAllImage } from "../api/ImageApi";
import { getIdUserByToken, isToken } from "../utils/JwtService";
import { endpointBE } from "../utils/Constant";
import { toast } from "react-toastify";
import CartItemModel from "../model/CartItemModel";
import { Skeleton } from "@mui/material";
import ImageProduct from "./ImageProduct";
import "./ProductDetail.css";
import SelectQuantity from "./components/select-quantity/SelectQuantity";
import { CheckoutPage } from "../pages/CheckoutPage";


interface ProductDetailProps {}

const ProductDetail: React.FC<ProductDetailProps> = (props) => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng
	const { setTotalCart, cartList } = useCartItem();

	// Lấy mã sách từ url
	const { idProduct } = useParams();
	let idProductNumber: number = 0;

	// Ép kiểu về number
	try {
		idProductNumber = parseInt(idProduct + "");
		if (Number.isNaN(idProductNumber)) {
			idProductNumber = 0;
		}
	} catch (error) {
		console.error("Error: " + error);
	}

	// Khai báo biến
	const [product, setProduct] = useState<ProductModel | null>(null);
	const [loading, setLoading] = useState(true);
	const [erroring, setErroring] = useState(null);
	// Lấy sách ra
	useEffect(() => {
		getProductById(idProductNumber)
			.then((response) => {
				setProduct(response);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				setErroring(error.message);
			});
	}, []);

	// Lấy ra thể loại của sách
	const [productType, setProductType] = useState<ProductTypeModel[] | null>(null);
	useEffect(() => {
		getProductTypeByIdProduct(idProductNumber).then((response) => {
			setProductType(response.productTypeList);
		});
	}, []);
	const idProductType : number | undefined = 1;
	
	// Lấy ra hình ảnh của sách
	const [images, setImages] = useState<ImageModel[] | null>(null);
	useEffect(() => {
		getAllImage(idProductNumber)
			.then((response) => {
				setImages(response);
			})
			.catch((error) => {
				console.error(error);
			});
			console.log(idProductType);
	}, []);

	const [quantity, setQuantity] = useState(1);
	// Xử lý tăng số lượng
	const add = () => {
		if (quantity < (product?.quantity ? product?.quantity : 1)) {
			setQuantity(quantity + 1);
		}
	};

	// Xử lý giảm số lượng
	const reduce = () => {
		if (quantity > 1) {
			setQuantity(quantity - 1);
		}
	};

	// Xử lý thêm sản phẩm vào giỏ hàng
	const handleAddProduct = async (newProduct: ProductModel) => {
		// cái isExistproduct này sẽ tham chiếu đến cái cart ở trên, nên khi update thì cart nó cũng update theo
		let isExistproduct = cartList.find(
			(cartItem) => cartItem.product.idProduct=== newProduct.idProduct
		);
		// Thêm 1 sản phẩm vào giỏ hàng
		if (isExistproduct) {
			// nếu có rồi thì sẽ tăng số lượng
			isExistproduct.quantity += quantity;

			// Lưu vào db
			if (isToken()) {
				const request = {
					idCart: isExistproduct.idCart,
					quantity: isExistproduct.quantity,
				};
				const token = localStorage.getItem("token");
				fetch(endpointBE + `/cart-item/update-item`, {
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"content-type": "application/json",
					},
					body: JSON.stringify(request),
				}).catch((err) => console.log(err));
			}
		} else {
			 // Lưu vào db
			 if (isToken()) {
                try {
                    const request = [
                        {
                            quantity: 1,
                            product: newProduct,
                            idUser: getIdUserByToken(),
                        },
                    ];
                    const token = localStorage.getItem("token");
                    const response = await fetch(
                        endpointBE + "/cart-item/add-item",
                        {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "content-type": "application/json",
                            },
                            body: JSON.stringify(request),
                        }
                    );

                    if (response.ok) {
                        const idCart = await response.json();
                        cartList.push({
                           idCart : idCart,
                            quantity : 1,
                            product: newProduct,
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                cartList.push({
                    quantity : 1,
                    product : newProduct,
                });
            }
		}
		// Lưu vào localStorage
		localStorage.setItem("cart", JSON.stringify(cartList));
		// Thông báo toast
		toast.success("Thêm vào giỏ hàng thành công");
		setTotalCart(cartList.length);
	};

	// Viewer hình ảnh
	const [currentImage, setCurrentImage] = useState(0);
	const [isViewerOpen, setIsViewerOpen] = useState(false);

	let imageList: string[] = [];
	if (images !== undefined && images !== null) {
		imageList = images.map((image) => {
			return image.dataImage || image.urlImage;
		}) as string[];
	}

	const openImageViewer = useCallback((index: number) => {
		setCurrentImage(index);
		setIsViewerOpen(true);
	}, []);

	const closeImageViewer = () => {
		setCurrentImage(0);
		setIsViewerOpen(false);
	};

	const [isCheckout, setIsCheckout] = useState(false);
	const [cartItem, setCartItem] = useState<CartItemModel[]>([]);
	const [totalPriceProduct, setTotalPriceProduct] = useState(0);
	// function handleBuyNow(sanPhamMoi: SanPhamModel) {
	// 	setCartItem([{ soLuong , sanPham: sanPhamMoi }]);
	// 	setIsCheckout(!isCheckout);
	// 	setTotalPriceProduct(sanPhamMoi.giaBan * soLuong);
	// }

	if (loading) {
		return (
			<div className='container-book container mb-5 py-5 px-5 bg-light'>
				<div className='row'>
					<div className='col-4'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={400}
						/>
					</div>
					<div className='col-8 px-5'>
						<Skeleton
							className='my-3'
							variant='rectangular'
							height={100}
						/>
						<Skeleton className='my-3' variant='rectangular' />
						<Skeleton className='my-3' variant='rectangular' />
						<Skeleton className='my-3' variant='rectangular' />
					</div>
				</div>
			</div>
		);
	}

	if (erroring) {
		return (
			<div>
				<h1>Gặp lỗi: {erroring}</h1>
			</div>
		);
	}

	if (product === null) {
		return (
			<div>
				<h1>Sản phẩm không tồn tại </h1>
			</div>
		);
	}

	return (
		<>
			{!isCheckout ? (
				 <>
				<div className="container">
  <div className="row mt-4 mb-4">
    <div className="col-4 product-image">
      <ImageProduct idProduct={idProductNumber} />
    </div>
    <div className="col-6 product-details">
      <div className="row">
        <div className="col-12">
          <h1 className="product-title text-left">
            {product.nameProduct} - {product.unit}
          </h1>
          <div className="row mt-4 text-left">
            <div className="col-4">
              <p className="mb-1">Giá niêm yết:</p>
              <p className="mb-1">Giá khuyến mãi:</p>
            </div>
            <div className="col-8">
              <div className="price mb-2">
                <span className="original-price text-muted">
                  <del>{product.listPrice.toLocaleString()} đ</del>
                </span>
                <br />
                <span className="discounted-price text-danger">
                  <strong>{product.sellPrice.toLocaleString()} đ</strong>
                </span>
              </div>
            </div>
          </div>
          <hr />
          <div className="quantity-section">
            <strong className="quantity-label">Số lượng: </strong>
            <SelectQuantity
              max={product.quantity}
              quantity={quantity}
              setQuantity={setQuantity}
              add={add}
              reduce={reduce}
            />
            <span className="ms-4">
              {product.quantity} sản phẩm có sẵn
            </span>
          </div>
          <button className="btn btn-danger btn-add-to-cart" onClick={()=>handleAddProduct(product)}>
            <i className="fas fa-shopping-cart"></i> Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

			   </>
			) : (
				<CheckoutPage
					setIsCheckout={setIsCheckout}
					cartList={cartItem}
					totalPriceProduct={totalPriceProduct}
					isBuyNow={true}
				/>
               
				
			)}
		</>
	);
};

export default ProductDetail;