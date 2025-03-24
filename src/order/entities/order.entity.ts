import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('order')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // dự án hoặc bán lẻ
    @Column()
    invoice_type: string;

    // khách mua
    @Column()
    manager_id: string;

    // hóa đơn của dự án nào
    @Column()
    project_id: string

    @Column('decimal', { precision: 10, scale: 2 })
    total_order: number;

    //các sản phẩm được mua với giá xếp loại khách l1 l2 l3 lưu markdown
    @Column()
    product_buy: string;

    @Column('uuid')
    tenant_id: string;

    //trạng thái hóa đơn đã thanh toán chưa thanh toán
    @Column()
    payment_status: string;

    // loại thanh toán trừ ck hoặc tiền mặt chuyển khoản
    @Column()
    payment_type : string;

    // giá sản phẩm gốc lúc lên hóa đơn lưu markdown
    @Column()
    original_price: string

    //chiết khấu được áp dụng bởi người mua l1 l2 l3
    @Column()
    price_type_applied : string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    delete_at: Date;

}