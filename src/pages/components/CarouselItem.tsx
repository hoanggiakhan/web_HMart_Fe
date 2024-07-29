import React, { useEffect, useState } from "react";
import ProductModel from "../../model/ProductModel";
import ImageModel from "../../model/ImageModel";
import { getOneImage } from "../../api/ImageApi";




  interface CarouselItemInterface{
     product : ProductModel;
  }
const CarouselItem : React.FC<CarouselItemInterface> = (props)=>{
    const idProduct : number=props.product.idProduct;
    const [imageList,setImageList] = useState<ImageModel[]>([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);
    useEffect(()=>{
     getOneImage(idProduct).then(
         imageData =>{
             setImageList(imageData);
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
    let dataImage:string ="";
    if(imageList[0] && imageList[0].dataImage){
        dataImage=imageList[0].dataImage;
    }
      return(
      
        <div className="row align-items-center">
            <div className="col-5 text-center">
                <img src={dataImage} className="float-end" style={{ width: '150px' }} />
            </div>
            <div className="col-7">
                <h5>{props.product.nameProduct}</h5>
                <p>{props.product.description}</p>
            </div>
        </div>
    );
}
export default CarouselItem;