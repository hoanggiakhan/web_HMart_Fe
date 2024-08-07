import React, { FormEvent, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Box, Button } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import ProductModel from "../../../model/ProductModel";
import ProductTypeModel from "../../../model/ProductTypeModel";
import { getProductByIdAllInformation } from "../../../api/ProductApi";
import { getAllProductType } from "../../../api/ProductTypeApi";
import { endpointBE } from "../../../utils/Constant";
import { SelectMultiple } from "../../../utils/SelectMultiple";
interface ProductFormProps {
    id: number;
    option: string;
    setKeyCountReload?: any;
    handleCloseModal: any;
}

export const ProductForm: React.FC<ProductFormProps> = (props) => {
    const [product, setProduct] = useState<ProductModel>({
        idProduct: 0,
        nameProduct: "",
        description: "",
        listPrice: NaN,
        sellPrice: NaN,
        quantity: NaN,
        soldQuantity: NaN,
        discountPercent: 0,
        relatedImg: [],
        dataImage: "",
        idProductType: [],
        producttypesList: [],
        unit: "",
    });
    const [productTypeList, setProductTypeList] = useState<ProductTypeModel[]>([]);
    const [productTypesListSelected, setProductTypesListSelected] = useState<number[]>([]);
    const [previewThumbnail, setPreviewThumbnail] = useState("");
    const [previewRelatedImages, setPreviewRelatedImages] = useState<string[]>(
        []
    );
    // Giá trị khi đã chọn ở trong select multiple
    const [SelectedListName, setSelectedListName] = useState<any[]>([]);
    // Khi submit thì btn loading ...
    const [statusBtn, setStatusBtn] = useState(false);
    // Biến reload (cho selectMultiple)
    const [reloadCount, setReloadCount] = useState(0);

    // Lấy dữ liệu khi update
    useEffect(() => {
        if (props.option === "update") {
            getProductByIdAllInformation(props.id).then((response) => {
                setProduct(response as ProductModel);
                setPreviewThumbnail(response?.dataImage as string);
                setPreviewRelatedImages(response?.relatedImg as string[]);
                response?.producttypesList?.forEach((data) => {
                    setSelectedListName((prev) => [...prev, data.nameProductType]);
                    setProduct((prevProduct) => {
                        return {
                            ...prevProduct,
                            idProductType: [...(prevProduct.idProductType || []), data.idProductType],
                        };
                    });
                });
            });
        }
    }, [props.option, props.id]);

    // Khúc này lấy ra tất cả loại  để cho vào select
    useEffect(() => {
        getAllProductType().then((response) => {
            setProductTypeList(response.productTypeList);
        });
    }, [props.option]);

    // Khúc này để lưu danh sách thể loại của sản phẩm
    useEffect(() => {
        setProduct({ ...product, idProductType: productTypesListSelected });
    }, [productTypesListSelected]);

    async function hanleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const token = localStorage.getItem("token");

        let productRequest: ProductModel = product;
        if (productRequest.discountPercent === 0) {
            productRequest = { ...product, sellPrice: product.listPrice };
        }

       

        setStatusBtn(true);

        const endpoint =
            props.option === "add"
                ? endpointBE + "/product/add-product"
                : endpointBE + "/product/update-product";
        const method = props.option === "add" ? "POST" : "PUT";
        toast.promise(
            fetch(endpoint, {
                method: method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify(productRequest),
            })
                .then((response) => {
                    if (response.ok) {
                        setProduct({
                            idProduct: 0,
                            nameProduct: "",
                            description: "",
                            listPrice: NaN,
                            sellPrice: NaN,
                            quantity: NaN,
                            soldQuantity: NaN,
                            unit: "",
                        });
                        setPreviewThumbnail("");
                        setPreviewRelatedImages([]);
                        setReloadCount(Math.random());
                        setStatusBtn(false);
                        props.setKeyCountReload(Math.random());
                        props.handleCloseModal();
                        props.option === "add"
                            ? toast.success("Thêm sản phẩm thành công")
                            : toast.success("Cập nhật sản phẩm thành công");
                    } else {
                        toast.error("Gặp lỗi trong quá trình xử lý sản phẩm");
                        setStatusBtn(false);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setStatusBtn(false);
                    toast.error("Gặp lỗi trong quá trình xử lý sản phẩm");
                }),
            {
                pending: "Đang trong quá trình xử lý ...",
            }
        );
    }

    function handleThumnailImageUpload(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const inputElement = event.target as HTMLInputElement;

        if (inputElement.files && inputElement.files.length > 0) {
            const selectedFile = inputElement.files[0];

            const reader = new FileReader();

            // Xử lý sự kiện khi tệp đã được đọc thành công
            reader.onload = (e: any) => {
                // e.target.result chính là chuỗi base64
                const thumnailBase64 = e.target?.result as string;

                setProduct({ ...product, dataImage: thumnailBase64 });

                setPreviewThumbnail(URL.createObjectURL(selectedFile));
            };

            // Đọc tệp dưới dạng chuỗi base64
            reader.readAsDataURL(selectedFile);
        }
    }

    function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const inputElement = event.target as HTMLInputElement;

        if (inputElement.files && inputElement.files.length > 0) {
            const newPreviewImages = [...previewRelatedImages];

            if (newPreviewImages.length + inputElement.files.length > 5) {
                toast.warning("Chỉ được tải lên tối đa 5 ảnh");
                return;
            }

            // Duyệt qua từng file đã chọn
            for (let i = 0; i < inputElement.files.length; i++) {
                const selectedFile = inputElement.files[i];

                const reader = new FileReader();

                // Xử lý sự kiện khi tệp đã được đọc thành công
                reader.onload = (e: any) => {
                    // e.target.result chính là chuỗi base64
                    const thumbnailBase64 = e.target?.result as string;

                    setProduct((prevProduct) => ({
                        ...prevProduct,
                        relatedImg: [...(prevProduct.relatedImg || []), thumbnailBase64],
                    }));

                    newPreviewImages.push(URL.createObjectURL(selectedFile));

                    // Cập nhật trạng thái với mảng mới
                    setPreviewRelatedImages(newPreviewImages);
                };

                // Đọc tệp dưới dạng chuỗi base64
                reader.readAsDataURL(selectedFile);
            }
        }
    }

    return (
        <div>
            <Typography className='text-center' variant='h4' component='h2'>
                {props.option === "add" ? "TẠO SẢN PHẨM" : "SỬA SẢN PHẨM"}
            </Typography>
            <hr />
            <div className='container px-5'>
                <form onSubmit={hanleSubmit} className='form'>
                    <input type='hidden' id='idProduct' value={product?.idProduct} hidden />
                    <div className='row'>
                        <div
                            className={props.option === "update" ? "col-4" : "col-6"}
                        >
                            <Box
                                sx={{
                                    "& .MuiTextField-root": { mb: 3 },
                                }}
                            >
                                <TextField
                                    required
                                    id='filled-required'
                                    label='Tên sản phẩm'
                                    style={{ width: "100%" }}
                                    value={product.nameProduct}
                                    onChange={(e: any) =>
                                        setProduct({ ...product, nameProduct: e.target.value })
                                    }
                                    size='small'
                                />


                                <TextField
                                    required
                                    id='filled-required'
                                    label='Giá niêm yết'
                                    style={{ width: "100%" }}
                                    type='number'
                                    value={
                                        Number.isNaN(product.listPrice) ? "" : product.listPrice
                                    }
                                    onChange={(e: any) =>
                                        setProduct({
                                            ...product,
                                            listPrice: parseInt(e.target.value),
                                        })
                                    }
                                    size='small'
                                />
                                <TextField
                                    required
                                    id='filled-required'
                                    label='Đơn vị tính'
                                    style={{ width: "100%" }}
                                    value={product.unit}
                                    onChange={(e: any) =>
                                        setProduct({ ...product, unit: e.target.value })
                                    }
                                    size='small'
                                />
                            </Box>
                        </div>
                        <div
                            className={props.option === "update" ? "col-4" : "col-6"}
                        >
                            <Box
                                sx={{
                                    "& .MuiTextField-root": { mb: 3 },
                                }}
                            >
                                <TextField
                                    required
                                    id='filled-required'
                                    label='Số lượng'
                                    style={{ width: "100%" }}
                                    type='number'
                                    value={
                                        Number.isNaN(product.quantity) ? "" : product.quantity
                                    }
                                    onChange={(e: any) =>
                                        setProduct({
                                            ...product,
                                            quantity: parseInt(e.target.value),
                                        })
                                    }
                                    size='small'
                                />
                                <SelectMultiple
                                    selectedList={productTypesListSelected}
                                    setSelectedList={setProductTypesListSelected}
                                    selectedListName={SelectedListName}
                                    setSelectedListName={setSelectedListName}
                                    values={productTypeList}
                                    setValue={setProduct}
                                    key={reloadCount}
                                    required={true}
                                />

                                <TextField
                                    id='filled-required'
                                    label='Giảm giá (%)'
                                    style={{ width: "100%" }}
                                    type='number'
                                    value={
                                        Number.isNaN(product.discountPercent)
                                            ? ""
                                            : product.discountPercent
                                    }
                                    onChange={(e: any) => {
                                        setProduct({
                                            ...product,
                                            discountPercent: parseInt(e.target.value),
                                            sellPrice:
                                                product.listPrice -
                                                Math.round(
                                                    (product.listPrice *
                                                        Number.parseInt(e.target.value)) /
                                                    100
                                                ),
                                        });
                                    }}
                                    size='small'
                                />
                            </Box>
                        </div>
                        {props.option === "update" && (
                            <div className='col-4'>
                                <Box
                                    sx={{
                                        "& .MuiTextField-root": { mb: 3 },
                                    }}
                                >
                                    <TextField
                                        id='filled-required'
                                        label='Giá bán'
                                        style={{ width: "100%" }}
                                        value={product.sellPrice.toLocaleString("vi-vn")}
                                        type='number'
                                        InputProps={{
                                            disabled: true,
                                        }}
                                        size='small'
                                    />

                                    <TextField
                                        id='filled-required'
                                        label='Đã bán'
                                        style={{ width: "100%" }}
                                        value={product.soldQuantity}
                                        InputProps={{
                                            disabled: true,
                                        }}
                                        size='small'
                                    />

                                </Box>
                            </div>
                        )}
                        <div className='col-12'>
                            <Box>
                                <TextField
                                    id='outlined-multiline-flexible'
                                    label='Mô tả sản phẩm'
                                    style={{ width: "100%" }}
                                    multiline
                                    maxRows={5}
                                    value={product.description}
                                    onChange={(e: any) =>
                                        setProduct({ ...product, description: e.target.value })
                                    }
                                    required
                                />
                            </Box>
                        </div>
                        <div className='d-flex align-items-center mt-3'>
                            <Button
                                size='small'
                                component='label'
                                variant='outlined'
                                startIcon={<CloudUpload />}
                            >
                                Tải ảnh thumbnail
                                <input
                                    style={{ opacity: "0", width: "10px" }}
                                    required={props.option === "update" ? false : true}
                                    type='file'
                                    accept='image/*'
                                    onChange={handleThumnailImageUpload}
                                    alt=''
                                />
                            </Button>
                            <img src={previewThumbnail} alt='' width={100} />
                        </div>
                        <div className='d-flex align-items-center mt-3'>
                            <Button
                                size='small'
                                component='label'
                                variant='outlined'
                                startIcon={<CloudUpload />}
                            >
                                Tải ảnh liên quan
                                <input
                                    style={{ opacity: "0", width: "10px" }}
                                    // required
                                    type='file'
                                    accept='image/*'
                                    onChange={handleImageUpload}
                                    multiple
                                    alt=''
                                />
                            </Button>
                            {previewRelatedImages.map((imgURL) => (
                                <img src={imgURL} alt='' width={100} />
                            ))}
                            {previewRelatedImages.length > 0 && (
                                <Button
                                    onClick={() => {
                                        setPreviewRelatedImages([]);
                                        setProduct({ ...product, relatedImg: [] });
                                    }}
                                >
                                    Xoá tất cả
                                </Button>
                            )}
                        </div>
                    </div>
                    {props.option !== "view" && (
                        <LoadingButton
                            className='w-100 my-3'
                            type='submit'
                            loading={statusBtn}
                            variant='outlined'
                            sx={{ width: "25%", padding: "10px" }}
                        >
                            {props.option === "add" ? "Tạo sản phẩm" : "Lưu sản phẩm"}
                        </LoadingButton>
                    )}
                </form>
            </div>
        </div>
    );
};
