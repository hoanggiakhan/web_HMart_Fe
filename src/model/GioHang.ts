import SanPhamModel from "./SanPhamModel";

export interface GioHang {
    sanphams: SanPhamModel[];
    setSanphams: React.Dispatch<React.SetStateAction<SanPhamModel[]>>;
  }