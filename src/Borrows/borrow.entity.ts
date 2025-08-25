import { Book } from "src/Books/book.entity";
import { User } from "src/Users/user.entity";
import { Column, Entity,ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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


    @ManyToOne(() => User , (user) => user.borrows , {onDelete:"CASCADE"})
    user:User;

    @ManyToOne(() => Book , (book) => book.borrows , {onDelete:"CASCADE"})
    book:Book;
}