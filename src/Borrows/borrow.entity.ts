import { IsEnum } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum BorrowStatus  {
BORROWED = 'borrowed',
RETURNED = 'returned',
BOUGHT = 'bought',
}
@Entity('borrows')
export class Borrow{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    userId:number;

    @Column()
    bookId:number;

    @Column({type:'timestamp',default: () => 'CURRENT_TIMESTAMP'})
    borrowDate:string;

    @Column({type:'timestamp',nullable:true})
    returnDate:string;

    @Column({type:'enum' , enum:BorrowStatus , default:BorrowStatus.BORROWED})
    status:BorrowStatus;
}