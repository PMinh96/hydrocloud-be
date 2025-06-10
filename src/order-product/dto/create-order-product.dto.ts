export class CreateOrderProductDto {
    order_id: string;
    products: {
        product_id: string;
        quantity: number;
        product_price: number;
        discount_product: number;
        total_product_price: number;
    }[];
}