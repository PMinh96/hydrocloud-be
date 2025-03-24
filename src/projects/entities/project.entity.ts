
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    manager_id: string;

    @Column()
    adress: string;

    @Column()
    phone_number: string;

    //tiền ứng
    @Column('decimal', { precision: 10, scale: 2 })
    advance: number;

    @Column('uuid')
    tenant_id: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    delete_at: Date;
}

