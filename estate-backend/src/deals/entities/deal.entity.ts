import { IsDate, IsString } from "class-validator";
import { Agency } from "src/agencies/entities/agency.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { BaseTable } from "src/common/entities/base-table.entity";
import { Customer } from "src/customers/entities/customer.entity";
import { HouseProperty } from "src/house-properties/entities/house-property.entity";
import { Offer } from "src/offers/entities/offer.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Deal extends BaseTable {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Offer, offer => offer.deal)
    @JoinColumn({ name: 'offer_id' })
    offer: Offer;

    @ManyToOne(() => Customer, { nullable: true })
    buyer: Customer;

    @ManyToOne(() => Customer, { nullable: true })
    seller: Customer;

    @ManyToOne(() => Agency)
    buyAgency: Agency;

    @ManyToOne(() => Agency)
    sellAgency: Agency;

    @Column()
    dealDate: Date;

    @ManyToOne(() => User, user => user.deals)
    // @JoinTable({
    //     name: 'deal_dealer',
    //     joinColumn: { name: 'deal_id', referencedColumnName: 'id' },
    //     inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
    // })
    dealer: User;

    @OneToOne(() => HouseProperty)
    @JoinColumn({ name: 'house_property_id' })
    houseProperty: HouseProperty;

    @OneToMany(() => Comment, comment => comment.deal)
    comments: Comment[];
}