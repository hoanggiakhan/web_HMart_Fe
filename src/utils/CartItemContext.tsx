import React, { createContext, useContext, useEffect, useState } from "react";
import GioHangModel from "../model/GioHangModel";


interface GioHangProps {
	children: React.ReactNode;
}

interface GioHangType {
	gioHangList: GioHangModel[];
	setGioHangList: any;
	tongSP: number;
	setTongSP: any;
}

const GioHang = createContext<GioHangType | undefined>(undefined);

export const GioHangProvider: React.FC<GioHangProps> = (props) => {
	const [gioHangList, setGioHangList] = useState<GioHangModel[]>([]);
	const [tongSP, setTongSP] = useState(0);

	useEffect(() => {
		const cartData: string | null = localStorage.getItem("cart");
		let cart: GioHangModel[] = [];
		cart = cartData ? JSON.parse(cartData) : [];
		setGioHangList(cart);
		setTongSP(cart.length);
	}, []);

	return (
		<GioHang.Provider
			value={{ gioHangList, setGioHangList, tongSP, setTongSP }}
		>
			{props.children}
		</GioHang.Provider>
	);
};

export const useCartItem = (): GioHangType => {
	const context = useContext(GioHang);
	if (!context) {
		throw new Error("Lỗi context");
	}
	return context;
};
