class HinhAnhModel{
    maHinhAnh : number;
    tenHinhAnh ?: string;
    laICon ?: boolean;
    duongDan ?: string;
    duLieuAnh ?: string;
    constructor(
      maHinhAnh : number,
      tenHinhAnh : string,
      laICon : boolean,
      duongDan : string,
      duLieuAnh : string
    ){
      this.maHinhAnh=maHinhAnh;
      this.tenHinhAnh=tenHinhAnh;
      this.laICon=laICon;
      this.duongDan=duongDan;
      this.duLieuAnh=duLieuAnh;
    }
  
  }
  export default HinhAnhModel;