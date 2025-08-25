import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from "@nestjs/common";
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dtos/create-book-dtos";
import { Book, BookStatus } from "./book.entity";
import { Roles } from "src/Roles/roles.decorator";
import { Role } from "src/Roles/roles.enum";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/Roles/roles.guard";

@UseGuards(AuthGuard('jwt'),RolesGuard)
@Controller('books')
export class BooksControllers{
    constructor(
        private readonly booksService:BooksService){}


        @Post()
        @Roles(Role.ADMIN)
        async create (@Body() dto:CreateBookDto):Promise<Book>{
            return this.booksService.createBook(dto);
        }

        @Get()
        @Roles(Role.ADMIN)
        async getAllBooks(@Query('page') page:number = 1 , @Query('limit') limit:number = 10 ){
            return this.booksService.findAll(page,limit);
        }

        @Get('search')
        @Roles(Role.USER,Role.ADMIN)
        async searchBook(@Query() query:Partial<CreateBookDto>):Promise<Book[]>{
            return this.booksService.searchBooks(query);
        }

        @Get(':id')
        @Roles(Role.ADMIN)
        async getById(@Param('id') id:string):Promise<Book>{
            return this.booksService.findOne(+id);
        }

        @Put(':id')
        @Roles(Role.ADMIN)
        async update(@Param('id') id:string , @Body() dto:Partial<CreateBookDto>):Promise<Book>{
            return this.booksService.updateBook(+id,dto);
        }

        @Delete(':id')
        @Roles(Role.ADMIN)
        async delete(@Param('id') id:string):Promise<{message:string}>{
            return this.booksService.deleteBook(+id)
        }

        @Patch(':id/status')
        @Roles(Role.ADMIN)
        async change(@Param('id') id:string , @Body('status') status:BookStatus):Promise<Book>{
            return this.booksService.changeStatus(+id,status);
        }
}