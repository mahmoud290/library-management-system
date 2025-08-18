import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dtos/create-book-dtos";
import { Book, BookStatus } from "./book.entity";

@Controller('books')
export class BooksControllers{
    constructor(
        private readonly booksService:BooksService){}


        @Post()
        async create (@Body() dto:CreateBookDto):Promise<Book>{
            return this.booksService.createBook(dto);
        }

        @Get()
        async getAllBooks():Promise<Book[]>{
            return this.booksService.findAll();
        }

        @Get(':id')
        async getById(@Param('id') id:string):Promise<Book>{
            return this.booksService.findOne(+id);
        }

        @Put(':id')
        async update(@Param('id') id:string , @Body() dto:Partial<CreateBookDto>):Promise<Book>{
            return this.booksService.updateBook(+id,dto);
        }

        @Delete(':id')
        async delete(@Param('id') id:string):Promise<{message:string}>{
            return this.booksService.deleteBook(+id)
        }

        @Patch(':id/status')
        async change(@Param('id') id:string , @Body('status') status:BookStatus):Promise<Book>{
            return this.booksService.changeStatus(+id,status);
        }

        @Get('search')
        async searchBook(@Query() query:Partial<CreateBookDto>):Promise<Book[]>{
            return this.booksService.searchBooks(query);
        }
}