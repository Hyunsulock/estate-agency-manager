import { CreateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";

export class BaseTable {
    @CreateDateColumn()
    @Exclude()
    createdAt: Date;

    @CreateDateColumn()
    @Exclude()
    updatedAt: Date;
}