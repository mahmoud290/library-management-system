import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user-dto";
import { User } from "./user.entity";
import { Roles } from "src/Roles/roles.decorator";
import { Role } from "src/Roles/roles.enum";

@Controller('users')
export class UsersController{
    constructor(
        private readonly usersService:UsersService,
    ){}

    @Post()
    @Roles(Role.ADMIN)
    async create(@Body() dto:CreateUserDto):Promise<User>{
        return this.usersService.createUser(dto);
    }

    @Get()
    @Roles(Role.ADMIN)
    async getAll():Promise<User[]>{
        return this.usersService.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    async getById(@Param('id') id:number):Promise<User>{
        return this.usersService.findOne(+id);
    }

    @Put(':id')
    @Roles(Role.ADMIN)
    async update(@Param('id') id:number , @Body() dto:Partial<CreateUserDto>):Promise<User>{
        return this.usersService.updateUser(+id,dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    async delete(@Param('id') id:number):Promise<{message:string}>{
        return this.usersService.deleteUser(+id);
    }

    @Post(':userId/apply/:bookId')
    @Roles(Role.ADMIN)
    async applyBook(@Param('userId') userId:number , @Param('bookId') bookId:number):Promise<{message:string}>{
        return this.usersService.applyToBook(userId,bookId);
    }
}