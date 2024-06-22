import React, { createContext, useContext, useEffect, useState } from "react";
import GioHangModel from "../../model/GioHangModel";



interface CartItemProps {
	children: React.ReactNode;
}

interface CartItemType {
	gioHang: GioHangModel[];
	setGioHang: any;
	tongGioHang: number;
	setTongGioHang: any;
}

const CartItem = createContext<CartItemType | undefined>(undefined);

export const CartItemProvider: React.FC<CartItemProps> = (props) => {
	const [gioHang, setGioHang] = useState<GioHangModel[]>([]);
	const [tongGioHang, setTongGioHang] = useState(0);

	useEffect(() => {
		const cartData: string | null = localStorage.getItem("cart");
		let cart: GioHangModel[] = [];
		cart = cartData ? JSON.parse(cartData) : [];
		setGioHang(cart);
		setTongGioHang(cart.length);
	}, []);

	return (
		<CartItem.Provider
			value={{ gioHang, setGioHang, tongGioHang, setTongGioHang }}
		>
			{props.children}
		</CartItem.Provider>
	);
};

export const useCartItem = (): CartItemType => {
	const context = useContext(CartItem);
	if (!context) {
		throw new Error("Lỗi context");
	}
	return context;
};
