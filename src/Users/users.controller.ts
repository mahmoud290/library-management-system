import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user-dto";
import { User } from "./user.entity";

@Controller('users')
export class UsersController{
    constructor(
        private readonly usersService:UsersService,
    ){}

    @Post()
    async create(@Body() dto:CreateUserDto):Promise<User>{
        return this.usersService.createUser(dto);
    }

    @Get()
    async getAll():Promise<User[]>{
        return this.usersService.findAll();
    }

    @Get(':id')
    async getById(@Param('id') id:number):Promise<User>{
        return this.usersService.findOne(+id);
    }

    @Put(':id')
    async update(@Param('id') id:number , @Body() dto:Partial<CreateUserDto>):Promise<User>{
        return this.usersService.updateUser(+id,dto);
    }

    @Delete(':id')
    async delete(@Param('id') id:number):Promise<{message:string}>{
        return this.usersService.deleteUser(+id);
    }

    @Post(':userId/apply/:bookId')
    async applyBook(@Param('userId') userId:number , @Param('bookId') bookId:number):Promise<{message:string}>{
        return this.usersService.applyToBook(userId,bookId);
    }
}