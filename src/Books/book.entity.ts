import { Borrow } from "../Borrows/borrow.entity";
import { User } from "../Users/user.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum BookStatus {
    AVAILABLE ='available',
    BORROWED = 'borrowed',
    SOLD = 'sold',
}
@Entity('books')
export class Book{

@PrimaryGeneratedColumn()
id:number;

@Column()
title:string;

@Column()
author:string;

@Column()
price:number;

@Column({type:'enum',enum:BookStatus,default:BookStatus.AVAILABLE})
status:BookStatus;

@ManyToMany(()=> User, (user)=> user.books)
users:User[];

@OneToMany(() => Borrow, (borrow) => borrow.book)
borrows: Borrow[];

}