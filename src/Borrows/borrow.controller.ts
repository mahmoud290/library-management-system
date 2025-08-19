import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { BorrowsService } from "./borrow.service";
import { Borrow } from "./borrow.entity";
import { CreateBorrowDto } from "./dtos/create-borrow-dto";

@Controller('borrows')
export class BorrowsController{
    constructor(
        private readonly borrowsService:BorrowsService,
    ){}

    @Post()
    async create(@Body() dto:CreateBorrowDto):Promise<Borrow>{
        return this.borrowsService.createBorrow(dto);
    }

    @Get()
    async getAllBorrows():Promise<Borrow[]>{
        return this.borrowsService.findAll();
    }

    @Get(':id')
    async getById(@Param('id') id:string):Promise<Borrow>{
        return this.borrowsService.getByID(+id);
    }

    @Patch(':id')
    async update(@Param('id') id:string , @Body() dto:Partial<CreateBorrowDto>):Promise<Borrow>{
        return this.borrowsService.updateBorrow(+id,dto);
    }

    @Delete(':id')
    async delete(@Param('id') id:string):Promise<{message:string}>{
        return this.borrowsService.deleteBorrow(+id);
    }
}