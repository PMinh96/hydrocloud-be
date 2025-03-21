import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() 
  name: string;

  @Column({ nullable: false })
  address?: string;

  @Column({ nullable: false })
  picture: string;

  @Column()
  phone_number: string;

  @Column({ type: 'timestamp', nullable: false })
  rented_from: Date;

  @Column({ type: 'timestamp', nullable: false })
  rented_until: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
