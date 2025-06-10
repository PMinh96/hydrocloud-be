export class CreateOrderDto {
    // dự án hoặc bán lẻ
    invoice_type: string;
    // khách mua
    manager_id: string;
    // hóa đơn của dự án nào
    project_id: string
    total_order: number;
    //các sản phẩm được mua với giá xếp loại khách l1 l2 l3 lưu markdown
    product_buy: string;
    tenant_id: string;
    //trạng thái hóa đơn đã thanh toán chưa thanh toán
    payment_status: string;
    // loại thanh toán trừ ck hoặc tiền mặt chuyển khoản
    payment_type: string;
    // giá sản phẩm gốc lúc lên hóa đơn lưu markdown
    original_price: string
    //chiết khấu được áp dụng bởi người mua l1 l2 l3
    price_type_applied: string;
    customer_name: string;
    products: {
        product_id: string;
        quantity: number;
        product_price: number;
        discount_product: number;
        total_product_price: number;
    }[]
}
