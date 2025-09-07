import { Book } from "../Books/book.entity";
import { Borrow } from "../Borrows/borrow.entity";
import { Role } from "../Roles/roles.enum";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({nullable:true})
    age:number;

    @Column({nullable:true})
    emailConfirmed:boolean;

    @Column({type:'enum',enum:Role,default:Role.USER})
    role:Role;

    @ManyToMany(() => Book, (book)=> book.users,{cascade:true})
    @JoinTable()
    books:Book[];

    @OneToMany(() => Borrow , (borrow)=> borrow.user)
    borrows:Borrow[]
}