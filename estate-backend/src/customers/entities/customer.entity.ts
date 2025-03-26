import { Agency } from "src/agencies/entities/agency.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { BaseTable } from "src/common/entities/base-table.entity";
import { Deal } from "src/deals/entities/deal.entity";
import { HouseProperty } from "src/house-properties/entities/house-property.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Customer extends BaseTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ nullable: true })
    intro: string;

    @Column({ nullable: true, length: 20 })
    phoneNumber: string;

    @ManyToOne(() => Agency, agency => agency.customers)
    @JoinColumn({ name: 'agency_id' })
    agency: Agency;

    @OneToMany(() => HouseProperty, houseProperty => houseProperty.owner)
    houseProperties: HouseProperty[];

    // Inverse relationship: All deals where this customer is the buyer.
    @OneToMany(() => Deal, deal => deal.buyer, {nullable: true})
    dealsAsBuyer: Deal[];

    // Inverse relationship: All deals where this customer is the seller.
    @OneToMany(() => Deal, deal => deal.seller, { nullable: true })
    dealsAsSeller: Deal[];

    @OneToMany(() => Comment, comment => comment.customer)
    comments: Comment[];



}