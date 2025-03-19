import { Apartment } from "src/apartments/entities/apartment.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { BaseTable } from "src/common/entities/base-table.entity";
import { Customer } from "src/customers/entities/customer.entity";
import { HouseProperty } from "src/house-properties/entities/house-property.entity";
import { Offer } from "src/offers/entities/offer.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Agency extends BaseTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true, length: 20 })
    phoneNumber: string;

    @OneToMany(() => Apartment, apartment => apartment.agency)
    apartments: Apartment[];

    @OneToMany(() => User, user => user.agency, { nullable: true })
    staffs: User[];

    @OneToMany(() => Offer, offer => offer.agency, { nullable: true })
    offers: Offer[];

    @OneToMany(() => HouseProperty, houseProperty => houseProperty.agency)
    houseProperties: HouseProperty[];

    @OneToMany(() => Customer, customer => customer.agency)
    customers: Customer[];

    @OneToMany(() => Comment, comment => comment.agency)
    comments: Comment[];


}