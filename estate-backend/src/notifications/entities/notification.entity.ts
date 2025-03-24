import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Agency } from 'src/agencies/entities/agency.entity';
import { BaseTable } from 'src/common/entities/base-table.entity';

@Entity()
export class Notification extends BaseTable {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { nullable: true })
    user: User;

    @ManyToOne(() => Agency, { nullable: true })
    agency: Agency;

    @Column({ default: 'invite' })
    type: string;

    @Column({ type: 'text' })
    message: string;

    @Column({ default: false })
    accepted: boolean;

    @Column({ default: false })
    read: boolean;
}
