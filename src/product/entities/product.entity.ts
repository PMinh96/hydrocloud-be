import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    name: string;
  
    @Column('decimal', { precision: 10, scale: 2 })
    price_sale: number;
  
    @Column()
    inventory: number;
  
    @Column('decimal', { precision: 10, scale: 2 })
    price_in: number;

    @Column('decimal', { precision: 10, scale: 2 })
    Price_L1: number;

    @Column('decimal', { precision: 10, scale: 2 })
    Price_L2: number;

    @Column('decimal', { precision: 10, scale: 2 })
    Price_L3: number;
  
    @Column()
    unit: string;
  
    @Column('int', { default: 0 })
    discount_1: number; 
  
    @Column('int', { default: 0 })
    discount_2: number;

    @Column('uuid')
    tenant_id: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @DeleteDateColumn({type: 'timestamp'})
    delete_at: Date;
}
