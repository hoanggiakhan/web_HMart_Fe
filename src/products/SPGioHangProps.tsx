/* eslint-disable @typescript-eslint/no-redeclare */
import { Skeleton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GioHangModel from "../model/GioHangModel";
import { useCartItem } from "../utils/CartItemContext";
import { useConfirm } from "material-ui-confirm";
import HinhAnhModel from "../model/HinhAnhModel";
import { endpointBE } from "../utils/Enpoint";
import { isToken } from "../utils/JwtService";
import { toast } from "react-toastify";
import { layToanBoAnh } from "../api/HinhAnhAPI";
import TextEllipsis from "./componets/text-ellipsis/TextEllipsis";
import SelectQuantity from "./componets/select-quantity/SelectQuantity";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SanPhamModel from "../model/SanPhamModel";

interface ProductCartProps {
	cartItem: GioHangModel;
	handleRemovesanPham: any;
}

const SPGioHangProps: React.FC<ProductCartProps> = (props) => {
	const { setGioHangList, gioHangList } = useCartItem();
  const confirm = useConfirm();

  const initialSoLuong = props.cartItem.sanPham.soLuong !== undefined
    ? props.cartItem.soLuong > props.cartItem.sanPham.soLuong
      ? props.cartItem.sanPham.soLuong
      : props.cartItem.soLuong
    : props.cartItem.soLuong;

  const [soLuong, setsoLuong] = useState(initialSoLuong);
  const [loading, setLoading] = useState<boolean>(true);
  const [erroring, setErroring] = useState<string | null>(null);
  const [danhSachHinhAnh, setDanhSachHinhAnh] = useState<HinhAnhModel[]>([]);

  useEffect(() => {
    layToanBoAnh(props.cartItem.sanPham.maSanPham)
      .then(danhSach => {
        setDanhSachHinhAnh(danhSach);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        setErroring(error.message);
      });
  }, [props.cartItem.sanPham.maSanPham]);

  function handleConfirm() {
    confirm({
      title: "Xoá sản phẩm",
      description: "Bạn muốn bỏ sản phẩm này khỏi giỏ hàng không",
      confirmationText: "Xoá",
      cancellationText: "Huỷ",
    })
      .then(() => {
        props.handleRemovesanPham(props.cartItem.sanPham.maSanPham);
        if (isToken()) {
          const token = localStorage.getItem("token");
          fetch(endpointBE + `/gio-hang/${props.cartItem.maGioHang}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "content-type": "application/json",
            },
          }).catch((err) => console.log(err));
        }
      })
      .catch(() => {});
  }

  const xoaSanPham = (sanPham: SanPhamModel) => {
    const arr = gioHangList.filter((sp) => sp.sanPham.maSanPham !== sanPham.maSanPham);
    setGioHangList([...arr]);
  };

  const add = () => {
    if (soLuong < (props.cartItem.sanPham.soLuong ? props.cartItem.sanPham.soLuong : 1)) {
      setsoLuong(soLuong + 1);
      handleModifiedsoLuong(props.cartItem.sanPham.maSanPham, 1);
    } else {
      toast.warning("Số lượng tồn kho không đủ");
    }
  };

  const reduce = () => {
    if (soLuong - 1 === 0) {
      handleConfirm();
    } else if (soLuong > 1) {
      setsoLuong(soLuong - 1);
      handleModifiedsoLuong(props.cartItem.sanPham.maSanPham, -1);
    }
  };

  function handleModifiedsoLuong(maSanPham: number, soLuong: number) {
    const cartData: string | null = localStorage.getItem("cart");
    const cart: GioHangModel[] = cartData ? JSON.parse(cartData) : [];
    let isExistsanPham = cart.find((cartItem) => cartItem.sanPham.maSanPham === maSanPham);
    if (isExistsanPham) {
      isExistsanPham.soLuong += soLuong;
      if (isToken()) {
        const token = localStorage.getItem("token");
        fetch(endpointBE + `/cart-item/update-item`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            idCart: props.cartItem.maGioHang,
            soLuong: isExistsanPham.soLuong,
          }),
        }).catch((err) => console.log(err));
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    setGioHangList(cart);
  }

  if (loading) {
    return (
      <>
        <Skeleton className='my-3' variant='rectangular' />
      </>
    );
  }

  if (erroring) {
    return (
      <>
        <h4>Lỗi ...</h4>
      </>
    );
  }

  let duLieuAnh: string = danhSachHinhAnh[0]?.duLieuAnh || "";
  
	return (
		<>
			<div className="d-flex justify-content-between align-items-center">
    <div className="d-flex align-items-center" style={{ width: '30%' }}>
        <img src={duLieuAnh} alt="Product" className="img-fluid mr-3" style={{ width: '50px', height: '50px' }} />
        <div>
            <p className="mb-1">{props.cartItem.sanPham.tenSanPham}</p>
            <small>ĐVT: {props.cartItem.sanPham.donViTinh}</small>
        </div>
    </div>
    <div className="d-flex flex-column align-items-end" style={{ width: '20%' }}>
        <span className="text-danger mr-2">
            <del>{props.cartItem.sanPham.giaNiemYet.toLocaleString()} ₫</del>
        </span>
        <span className="d-block">{props.cartItem.sanPham.giaBan.toLocaleString()} ₫</span>
    </div>
    <div className="d-flex align-items-center" style={{ width: '20%' }}>
        <div className="d-flex align-items-center border border-danger p-2 btn btn-sm p-2" style={{ maxWidth: '150px', maxHeight: '40px' }}>
            <button className="btn btn-sm text-danger" type="button" onClick={reduce}>-</button>
            <span className="text-danger mx-2">{soLuong}</span>
            <button className="btn btn-sm text-danger" type="button" onClick={add}>+</button>
        </div>
    </div>
    <div style={{ width: '10%' }}>
        <button className="btn btn-outline-danger btn-sm ml-3" onClick={() => xoaSanPham(props.cartItem.sanPham)}>X</button>
    </div>
</div>
			<hr className='my-3' />
		</>
	);
};

export default SPGioHangProps;
