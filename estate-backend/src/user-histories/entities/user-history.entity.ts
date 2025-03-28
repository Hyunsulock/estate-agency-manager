import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Agency } from "src/agencies/entities/agency.entity";
import { CreateDateColumn } from "typeorm";
@Entity()
export class UserHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User,)
    user: User;

    @ManyToOne(() => Agency,)
    agency: Agency;

    @Column()
    action: 'CREATE' | 'UPDATE' | 'DELETE';

    @Column()
    tableName: string;

    @Column()
    recordId: number;

    @Column({ nullable: true })
    field?: string;

    @Column({ type: 'jsonb', nullable: true })
    oldData?: any;

    @Column({ type: 'jsonb', nullable: true })
    newData?: any;

    @CreateDateColumn()
    createdAt: Date;
}