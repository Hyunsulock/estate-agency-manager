import { Exclude } from "class-transformer";
import { Agency } from "src/agencies/entities/agency.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { BaseTable } from "src/common/entities/base-table.entity";
import { Deal } from "src/deals/entities/deal.entity";
import { HousePropertyUserSaved } from "src/house-properties/entities/house-property-user-saved.entity";
import { UserHistory } from "src/user-histories/entities/user-history.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum Role {
    admin,
    manager,
    user,
    guest,
    blocked,
}

@Entity()
export class User extends BaseTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    email: string;

    @Column()
    @Exclude({
        toPlainOnly: true,
    })
    password: string;

    @Column({ length: 100, default: "NoName" })
    name: string;

    @Column({
        enum: Role,
        default: Role.user,
    })
    role: Role;

    @ManyToOne(() => Agency, agency => agency.staffs, { nullable: true })
    agency: Agency;

    @ManyToOne(() => UserHistory, userHistory => userHistory.user, { nullable: true })
    userHistory: UserHistory;

    @OneToMany(() => Deal, deal => deal.dealer, { nullable: true })
    deals: Deal[];


    @OneToMany(
        ()=> HousePropertyUserSaved,
        (housePropertyUserSaved) => housePropertyUserSaved.user
    )
    savedHouseProperties: HousePropertyUserSaved[];

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[];
}
