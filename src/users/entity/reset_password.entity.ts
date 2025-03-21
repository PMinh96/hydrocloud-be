
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('reset_password')
export class reset_password {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  otp: string;

  @Column()
  expiresAt: Date;
}
