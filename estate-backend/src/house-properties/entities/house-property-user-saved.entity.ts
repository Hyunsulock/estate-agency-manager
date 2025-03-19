import { HouseProperty } from 'src/house-properties/entities/house-property.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class HousePropertyUserSaved {

    @PrimaryColumn(
        {
            name: 'housePropertyId',
            type: 'int8'
        }
    )
    @ManyToOne(
        () => HouseProperty,
        (houseProperty) => houseProperty.savedUsers,
        {
            onDelete: "CASCADE",
        }
    )
    houseProperty: HouseProperty;

    @PrimaryColumn(
        {
            name: 'userId',
            type: 'int8'
        }
    )
    @ManyToOne(
        () => User,
        (user) => user.savedHouseProperties,
        {
            onDelete: "CASCADE",
        }
    )
    user: User;
}