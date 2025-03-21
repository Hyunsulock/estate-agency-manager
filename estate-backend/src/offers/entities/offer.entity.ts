import { IsOptional } from "class-validator";
import { Agency } from "src/agencies/entities/agency.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { Deal } from "src/deals/entities/deal.entity";
import { HouseProperty } from "src/house-properties/entities/house-property.entity";
import { ChildEntity, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, TableInheritance } from "typeorm";



@Entity()
export class Offer {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Agency, agency => agency.offers)
    agency: Agency;

    @ManyToOne(() => HouseProperty, houseProperty => houseProperty.offers, {
        onDelete: 'CASCADE'
    })
    houseProperty: HouseProperty;

    @Column('text')
    keyFeatures: string;

    @Column({ length: 20, default: 'active' })
    status: string;

    @OneToOne(() => Deal, deal => deal.offer, { nullable: true })
    deal: Deal;

    @Column({ nullable: true })
    rentDeposit?: number;

    @Column({ nullable: true })
    rentPrice?: number

    @Column({ nullable: true })
    jeonseDeposit?: number;

    @Column({ nullable: true })
    salePrice?: number

    @Column()
    tradeType: string;

    @OneToMany(() => Comment, comment => comment.offer)
    comments: Comment[];

}

