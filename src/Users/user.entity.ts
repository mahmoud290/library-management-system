import { Book } from "src/Books/book.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column()
    email:string;

    @Column()
    password:string;

    @Column()
    age:number;

    @Column()
    emailConfirmed:boolean;


    @ManyToMany(() => Book, (book)=> book.users,{cascade:true})
    @JoinTable()
    books:Book[];
}