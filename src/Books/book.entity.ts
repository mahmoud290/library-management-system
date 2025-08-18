import { User } from "src/Users/user.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

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
}