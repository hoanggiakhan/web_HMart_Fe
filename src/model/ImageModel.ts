class ImageModel{
    idImage : number;
    nameImage ?: string;
    isIcon ?: boolean;
    urlImage ?: string;
    dataImage ?: string;
    constructor(
      idImage : number,
      nameImage : string,
      isIcon : boolean,
      urlImage : string,
      dataImage : string
    ){
      this.idImage=idImage;
      this.nameImage=nameImage;
      this.isIcon=isIcon;
      this.urlImage=urlImage;
      this.dataImage=dataImage;
    }
  
  }
  export default ImageModel;