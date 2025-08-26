import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { BorrowsService } from "./borrow.service";
import { Borrow } from "./borrow.entity";
import { CreateBorrowDto } from "./dtos/create-borrow-dto";
import { Roles } from "src/Roles/roles.decorator";
import { Role } from "src/Roles/roles.enum";
import { RolesGuard } from "src/Roles/roles.guard";
import { JwtAuthGuard } from "src/Auth/jwt-auth.guard";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('borrows')
export class BorrowsController{
    constructor(
        private readonly borrowsService:BorrowsService,
    ){}

    @Post()
    @Roles(Role.ADMIN)
    async create(@Body() dto:CreateBorrowDto):Promise<Borrow>{
        return this.borrowsService.createBorrow(dto);
    }

    @Get()
    @Roles(Role.ADMIN)
    async getAllBorrows(@Query('page') page:string = '1',
    @Query('limit') limit:string = '10'){
        return this.borrowsService.findAll(+page, +limit);
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    async getById(@Param('id') id:string):Promise<Borrow>{
        return this.borrowsService.getByID(+id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    async update(@Param('id') id:string , @Body() dto:Partial<CreateBorrowDto>):Promise<Borrow>{
        return this.borrowsService.updateBorrow(+id,dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    async delete(@Param('id') id:string):Promise<{message:string}>{
        return this.borrowsService.deleteBorrow(+id);
    }

    @Get('my-borrows')
    @Roles(Role.USER, Role.ADMIN)
    async getMyBorrows(@Req() req): Promise<Borrow[]> {
    return this.borrowsService.findByUserId(req.user.id);
}
}