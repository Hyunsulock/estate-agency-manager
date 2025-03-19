import { Agency } from "src/agencies/entities/agency.entity";
import { Apartment } from "src/apartments/entities/apartment.entity";
import { Customer } from "src/customers/entities/customer.entity";
import { Offer } from "src/offers/entities/offer.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { HousePropertyUserSaved } from "./house-property-user-saved.entity";
import { Deal } from "src/deals/entities/deal.entity";
import { IsOptional } from "class-validator";
import { Comment } from "src/comments/entities/comment.entity";

@Entity()
export class HouseProperty {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    room: number;

    @Column()
    size: number;

    @Column()
    buildingNumber: number;

    @Column()
    floor: string;

    @Column()
    unitNumber: number;

    @ManyToOne(() => Apartment, apartment => apartment.houseProperties)
    @JoinColumn({ name: 'apartment_id' })
    apartment: Apartment;

    // Optional association with Agency.
    @ManyToOne(() => Agency, agency => agency.houseProperties, { nullable: true })
    @JoinColumn({ name: 'agency_id' })
    agency?: Agency;

    @OneToMany(() => Offer, offer => offer.houseProperty)
    offers: Offer[];

    @Column({ length: 20, default: 'active' })
    status: string;

    @OneToMany(
        ()=> HousePropertyUserSaved,
        (housePropertyUserSaved)=> housePropertyUserSaved.houseProperty
    )
    savedUsers: HousePropertyUserSaved[]

    @OneToOne(()=> Deal, {nullable: true})
    deal: Deal;

    @ManyToOne(() => Customer, customer => customer.houseProperties, {nullable: true})
    @JoinColumn({ name: 'customer_id' })
    owner?: Customer;

    @OneToMany(() => Comment, comment => comment.houseProperty)
    comments: Comment[];

}