import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dtos/create-user-dto";
import { User } from "./user.entity";
import { Roles } from "src/Roles/roles.decorator";
import { Role } from "src/Roles/roles.enum";
import { RolesGuard } from "src/Roles/roles.guard";
import { AuthGuard } from "@nestjs/passport";

@UseGuards(AuthGuard('jwt'),RolesGuard)
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
    async getAll(@Query('page') page:string = '1' , @Query('limit') limit:string = '10'){
        return this.usersService.findAll(+page,+limit);
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    async getById(@Param('id') id:string):Promise<User>{
        return this.usersService.findOne(+id);
    }

    @Put(':id')
    @Roles(Role.ADMIN)
    async update(@Param('id') id:string , @Body() dto:Partial<CreateUserDto>):Promise<User>{
        return this.usersService.updateUser(+id,dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    async delete(@Param('id') id:string):Promise<{message:string}>{
        return this.usersService.deleteUser(+id);
    }

    @Post(':userId/apply/:bookId')
    @Roles(Role.ADMIN)
    async applyBook(@Param('userId') userId:string , @Param('bookId') bookId:string):Promise<{message:string}>{
        return this.usersService.applyToBook(+userId,+bookId);
    }
}