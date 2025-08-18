import { IsEnum, IsNumber, IsString } from "class-validator";
import { BookStatus } from "../book.entity";


export class CreateBookDto{

    @IsString()
    title:string;

    @IsString()
    author:string;

    @IsNumber()
    price:number;

    @IsEnum(BookStatus)
    status:BookStatus;
}