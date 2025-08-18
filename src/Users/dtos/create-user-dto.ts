import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateUserDto{
    
    @IsString()
    name:string;

    @IsString()
    email:string;

    @IsString()
    password:string;

    @IsNumber()
    age:number;

    @IsBoolean()
    emailConfirmed: boolean;
}