function dinhDangSo(x: number|undefined){
    x=x!==undefined?x:0;
    if(isNaN(x)){
        return 0;
    }
    // Sử dụng toLoCaleString để định dạng số
    return x.toLocaleString("vi-VN");
}

export default dinhDangSo;