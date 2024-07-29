import React, { useEffect, useState } from "react";
import ProductModel from "../../model/ProductModel";
import { getNewProduct } from "../../api/ProductApi";
import CarouselItem from "./CarouselItem";


const Carousel : React.FC=()=>{
  const [productList,setProductList] = useState<ProductModel[]>([]);
   const [loading,setLoading] = useState(true);
   const [error,setError] = useState(null);
   useEffect(()=>{
    getNewProduct().then(
        kq=>{
            setProductList(kq.productList);
            setLoading(false)
        }
    ).catch(
        error => {
            setError(error.message);
        }
    );
},[]);
   if(loading){
    return(
      <div>
         <h1>Đang tải dữ liệu</h1>
      </div>
    );
   }

   if(error){
    return(
      <div>
         <h1>Gặp lỗi : {error}</h1>
      </div>
    );
   }
   
    return(
        <div>
        <div id="carouselExampleDark" className="carousel carousel-dark slide">
            <div className="carousel-inner">
                <div className="carousel-item active" data-bs-interval="10000">
                    <CarouselItem key={0} product={productList[0]} />
                </div>
                <div className="carousel-item " data-bs-interval="10000">
                    <CarouselItem key={1} product={productList[1]} />
                </div>
                <div className="carousel-item " data-bs-interval="10000">
                    <CarouselItem key={2} product={productList[2]} />
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    </div>
);
}
export default Carousel