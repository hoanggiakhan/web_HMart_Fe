/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import { IconButton } from "@mui/material";
import ProductModel from "../model/ProductModel";
import { useCartItem } from "../utils/CartItemContext";
import { getIdUserByToken, isToken } from "../utils/JwtService";
import { endpointBE } from "../utils/Constant";
import ImageModel from "../model/ImageModel";
import { getAllImage } from "../api/ImageApi";


interface ProductProps {
    product : ProductModel;
}

const ProductProps: React.FC<ProductProps> = ({ product }) => {
    const { setTotalCart, cartList } = useCartItem();
    const navigation = useNavigate();
    // Xử lý thêm sản phẩm vào giỏ hàng
    const handleAddProduct = async (newProduct: ProductModel) => {
        // cái isExistBook này sẽ tham chiếu đến cái cart ở trên, nên khi update thì cart nó cũng update theo
        let isExistProduct = cartList.find(
            (cartItem) => cartItem.product.idProduct === newProduct.idProduct
        );
        // Thêm 1 sản phẩm vào giỏ hàng
        if (isExistProduct) {
            // nếu có rồi thì sẽ tăng số lượng
            isExistProduct.quantity += 1;

            // Lưu vào db
            if (isToken()) {
                const request = {
                    idProductType: isExistProduct.idCart,
                    quantity: isExistProduct.quantity,
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
                            quantity : 1,
                            product : newProduct,
                           idUser : getIdUserByToken(),
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
                            idCart: idCart,
                            quantity: 1,
                            product: newProduct,
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                cartList.push({
                    quantity: 1,
                    product: newProduct,
                });
            }
        }
        // Lưu vào localStorage
        localStorage.setItem("cart", JSON.stringify(cartList));
        // Thông báo toast
        toast.success("Thêm vào giỏ hàng thành công");
        setTotalCart(cartList.length);
    };
    const [imageList, setImageList] = useState<ImageModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Xử lý chức năng yêu sách
    useEffect(() => {
        getAllImage(product.idProduct).then(
            imageData => {
                setImageList(imageData);
                setLoading(false)
            }
        ).catch(
            error => {
                setError(error.message);
            }
        );
    }, []);
    if (loading) {
        return (
            <div>
                <h1>Đang tải dữ liệu</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1>Gặp lỗi : {error}</h1>
            </div>
        );
    }
    let dataImage: string = "";
    if (imageList[0] && imageList[0].dataImage) {
        dataImage = imageList[0].dataImage;
    }
    
    const listPrice =product.listPrice !== undefined ?product.listPrice : 0;
    const sellPrice =product.sellPrice !== undefined ?product.sellPrice : 0;
    const phanTramGiamGia = listPrice !== 0 ? ((listPrice - sellPrice) / listPrice) * 100 : 0;
    return (
        <div className="col-md-3 mt-2" >
            <div className="card h-100">
                <Link to={`/product/${product.idProduct}`}>
                    <img
                        src={dataImage}
                        className="card-img-top"
                        alt={product.nameProduct}
                        style={{ height: '300px', objectFit: 'cover' }}
                    />
                </Link>

                <div className="card-body d-flex flex-column">
                    {/* Label giảm giá */}
                    <span className="badge bg-danger text-white position-absolute" style={{ top: '10px', left: '10px' }}>
                        -{Math.round(phanTramGiamGia)}%
                    </span>

                    <Link to={`/product/${product.idProduct}`} style={{ textDecoration: 'none' }}>
                        <h6 className="card-title text-center text-dark">{product.nameProduct}</h6>
                    </Link>

                    <p className="card-text text-center">ĐVT: {product.unit}</p>

                    <div className="price text-center mb-2">
                        <span className="original-price text-end">
                            <del>{product.listPrice.toLocaleString()} đ</del>
                        </span>

                        <span className="discounted-price text-danger">
                            <strong>{product.sellPrice.toLocaleString()} đ</strong>
                        </span>
                    </div>

                    <div className="mt-auto">
                        {
                           product.quantity !== 0 && (
                                <Tooltip title='Thêm vào giỏ hàng'>
                                    <button className="btn btn-danger w-100" onClick={() => handleAddProduct(product)} >
                                        <i className="fas fa-shopping-cart me-2"></i>
                                        Thêm vào giỏ
                                    </button>
                                </Tooltip>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductProps;