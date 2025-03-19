import { Agency } from "src/agencies/entities/agency.entity";
import { BaseTable } from "src/common/entities/base-table.entity";
import { Customer } from "src/customers/entities/customer.entity";
import { Deal } from "src/deals/entities/deal.entity";
import { HouseProperty } from "src/house-properties/entities/house-property.entity";
import { Offer } from "src/offers/entities/offer.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
// @Check(`("offer_id" IS NOT NULL AND "house_property_id" IS NOT NULL AND "customer_id" IS NULL AND "deal_id" IS NULL)
// OR ("offer_id" IS NULL AND 
//     ((CASE WHEN "house_property_id" IS NOT NULL THEN 1 ELSE 0 END) +
//      (CASE WHEN "customer_id" IS NOT NULL THEN 1 ELSE 0 END) +
//      (CASE WHEN "deal_id" IS NOT NULL THEN 1 ELSE 0 END)) = 1)`)
export class Comment extends BaseTable {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.comments)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Offer, offer => offer.comments, { nullable: true })
    @JoinColumn({ name: 'offer_id' })
    offer?: Offer;

    @ManyToOne(() => HouseProperty, houseProperty => houseProperty.comments, { nullable: true })
    @JoinColumn({ name: 'house_property_id' })
    houseProperty?: HouseProperty;

    @ManyToOne(() => Customer, customer => customer.comments, { nullable: true })
    @JoinColumn({ name: 'customer_id' })
    customer?: Customer;

    @ManyToOne(() => Deal, deal => deal.comments, { nullable: true })
    @JoinColumn({ name: 'deal_id' })
    deal?: Deal;

    @ManyToOne(() => Agency, agency => agency.comments, { nullable: true })
    @JoinColumn({ name: 'agency_id' })
    agency?: Agency;

    @Column('text')
    comment: string;

}


// @Entity()
// export class ChangeLog {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column()
//     tableName: string; // The name of the table where the change occurred

//     @Column()
//     recordId: number;  // The primary key of the changed record

//     @Column({ type: 'char', length: 1 })
//     operation: string; // 'I' for insert, 'U' for update, 'D' for delete

//     @Column({ nullable: true })
//     changedBy: number; // The user ID who made the change

//     @CreateDateColumn({ type: 'timestamp' })
//     changedAt: Date;

//     @Column({ type: 'jsonb', nullable: true })
//     data: any; // A JSON snapshot of the changed record
// }