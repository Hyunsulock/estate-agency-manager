import { Agency } from "src/agencies/entities/agency.entity";
import { BaseTable } from "src/common/entities/base-table.entity";
import { HouseProperty } from "src/house-properties/entities/house-property.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Apartment extends BaseTable {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    address?: string;

    @Column({ nullable: true })
    buildingYear?: number;

    @Column({ nullable: true })
    parking?: number;

    @ManyToOne(() => Agency, agency => agency.apartments, { nullable: true })
    @JoinColumn()
    agency?: Agency;

    @OneToMany(() => HouseProperty, houseProperty => houseProperty.apartment)
    houseProperties: HouseProperty[];

}