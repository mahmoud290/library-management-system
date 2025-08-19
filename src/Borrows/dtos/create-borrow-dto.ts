import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { BorrowStatus } from "../borrow.entity";

export class CreateBorrowDto{

    @IsNumber()
    userId:number;

    @IsNumber()
    bookId:number;

    
    @IsOptional()
    returnDate:string;

    @IsEnum(BorrowStatus)
    status:BorrowStatus;
}