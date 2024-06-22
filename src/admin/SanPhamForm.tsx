import React, { FormEvent, useState } from "react";
import RequireAdmin from "./RequireAdmin";

const SanPhamForm: React.FC = () => {
    const [sanPham, setSanPham] = useState({
        maSanPham: 0,
        tenSanPham: '',
        giaNiemYet: 0,
        giaBan: 0,
        moTa: '',
        soLuong: 0,
        donViTinh: ''
    })
    const xuLySubmit = (event: FormEvent) => {
         event.preventDefault();
         const token = localStorage.getItem('token');
        fetch('http://localhost:8080/san-pham',{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
            body : JSON.stringify(sanPham)
        }).then(response=>{
           if(response.ok){
              alert("Đã thêm sản phẩm thành công!");
             setSanPham({
                maSanPham: 0,
                tenSanPham: '',
                giaNiemYet: 0,
                giaBan: 0,
                moTa: '',
                soLuong: 0,
                donViTinh: ''
             })
           }else{
            alert("Gặp lỗi trong quá trình thêm sản phẩm");
           }
        }
        )
    }
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        fetch(  'http://localhost:8080/san-pham',
            {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(sanPham)
            }
        ).then((reponse)=>{
            if(reponse.ok){
                alert("Đã thêm sản phẩm thành công!");
                setSanPham({
                    maSanPham: 0,
                    tenSanPham: '',
                    giaNiemYet: 0,
                    giaBan: 0,
                    moTa: '',
                    soLuong: 0,
                    donViTinh: '',
                })
            }else{
                alert("Gặp lỗi trong quá trình thêm sản phẩm!");
            }
        })
    }

    return (
        <div className="container row d-flex align-items-center justify-content-center">
            <div className="col-6">
            <h1>THÊM SẢN PHẨM</h1>
            <form onSubmit={handleSubmit} className="form">
                <input type="hidden"
                    id="maSanPham"
                    value={sanPham.maSanPham}
                />

                <label htmlFor="tenSanPham">Tên sản phẩm <span className="text-danger">*</span></label>
                <input type="text"
                    className="form-control"
                    id="tenSanPham"
                    value={sanPham.tenSanPham}
                    onChange={e => setSanPham({ ...sanPham, tenSanPham: e.target.value })}
                    required
                />

                <label htmlFor="giaBan">Giá bán <span className="text-danger">*</span></label>
                <input type="number"
                    className="form-control"
                    id="giaBan"
                    value={sanPham.giaBan}
                    onChange={e => setSanPham({ ...sanPham, giaBan:parseFloat(e.target.value) })}
                    required
                />
                <label htmlFor="giaNiemYet">Giá niêm yết <span className="text-danger">*</span></label>
                <input type="number"
                    className="form-control"
                    id="giaNiemYet"
                    value={sanPham.giaNiemYet}
                    onChange={e => setSanPham({ ...sanPham, giaNiemYet:parseFloat(e.target.value) })}
                    required
                />
                <label htmlFor="soLuong">Số lượng <span className="text-danger">*</span></label>
                <input type="number"
                    className="form-control"
                    id="soLuong"
                    value={sanPham.soLuong}
                    onChange={e => setSanPham({ ...sanPham, soLuong:parseInt(e.target.value) })}
                    required
                />
                 <label htmlFor="moTa">Mô tả <span className="text-danger">*</span></label>
                <input type="text"
                    className="form-control"
                    id="moTa"
                    value={sanPham.moTa}
                    onChange={e => setSanPham({ ...sanPham, moTa: e.target.value })}
                    required
                />
                 <label htmlFor="donViTinh">Đơn vị tính <span className="text-danger">*</span></label>
                <input type="text"
                    className="form-control"
                    id="donViTinh"
                    value={sanPham.donViTinh}
                    onChange={e => setSanPham({ ...sanPham, donViTinh: e.target.value })}
                    required
                />
                <button className="btn btn-success mt-4" type="submit">Lưu</button>
            </form>
            </div>
            <div className="col-1">
                <img src={'./../../images/public/11.png'}  />
            </div>
        </div>
    );
   
}
const SanPhamForm_Admin = RequireAdmin(SanPhamForm);
export default SanPhamForm_Admin;