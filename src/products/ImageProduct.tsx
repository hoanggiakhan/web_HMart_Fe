import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import ImageModel from "../model/ImageModel";
import { getAllImage } from "../api/ImageApi";


  interface ImageProduct{
     idProduct : number;
  }
const ImageProduct : React.FC<ImageProduct> = (props)=>{
    const idProduct : number=props.idProduct;
    const [imageList,setImageList] = useState<ImageModel[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);
    
    useEffect(()=>{
     getAllImage(idProduct).then(
         danhSach =>{
             setImageList(danhSach);
             setLoading(false);
         }
     ).catch(
         error => {
            setLoading(false);
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
    let dataIamge:string ="";
    if(imageList[0] && imageList[0].dataImage){
        dataIamge=imageList[0].dataImage;
    }
      return(
    //     <div className="row">
    //     <div>
    //         {(hinhAnhDangChon) && <img src={hinhAnhDangChon.duLieuAnh} />}
    //     </div>
    //         <div className="row mt-2">
    //             {
    //                 danhSachHinhAnh.map((hinhAnh, index) => (
    //                     <div className={"col-3"} key={index}>
    //                         <img onClick={() => chonAnh(hinhAnh)} src={hinhAnh.duLieuAnh} style={{ width: '50px' }} />
    //                     </div>
    //                 ))
    //             }
    //         </div>
    // </div>


    <div className="row">
    <div className="col-12">
        <Carousel showArrows={true} showIndicators={true} >
            {
                imageList.map((image, index)=>(
                    <div key={index}>
                        <img src={image.dataImage} alt={`${image.nameImage}`} style={{maxWidth:"250px"}} />
                    </div>
                ))
            }
        </Carousel>
    </div>
</div>
      );
}
export default ImageProduct;