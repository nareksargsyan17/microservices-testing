import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class User{
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    email : string;

    @Column()
    password : string;


    @Column({default: false})
    role: boolean
}