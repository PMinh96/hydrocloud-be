import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('verify_otp')
export class VerifyOTP {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  user_id: string;

  @Column()
  otp: string;

  @Column()
  phone: string;

  @Column()
  verify_time: number;

  @Column()
  created_at: string;

  @Column()
  updated_at: string;
}
