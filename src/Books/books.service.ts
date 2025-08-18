import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Book, BookStatus } from "./book.entity";
import { Like, Repository } from "typeorm";
import { CreateBookDto } from "./dtos/create-book-dtos";

@Injectable()
export class BooksService{
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository:Repository<Book>,
    ){}

    async createBook(dto:CreateBookDto):Promise<Book>{
        const book = this.bookRepository.create(dto);
        return this.bookRepository.save(book);
    }

    async findAll():Promise<Book[]>{
        return this.bookRepository.find();
    }

    async findOne(id:number):Promise<Book>{
        const book = await this.bookRepository.findOneBy({id});
        if(!book){
            throw new NotFoundException(`Book with id ${id} not found`);
        }
        return book;
    }

    async updateBook(id:number,dto:Partial<CreateBookDto>):Promise<Book>{
        const book = await this.bookRepository.findOneBy({id});

        if(!book){
            throw new NotFoundException(`Book with id ${id} not found`);
        }
        this.bookRepository.merge(book, dto);
        return this.bookRepository.save(book);
    }

    async deleteBook (id:number):Promise<{message:string}>{
        const result = await this.bookRepository.delete(id);

        if(result.affected === 0){
            throw new NotFoundException(`Book with id ${id} not found`)
        }

        return { message: `Book with id ${id} deleted successfully` };
    }

    async changeStatus(id:number, status:BookStatus):Promise<Book>{
        const book = await this.bookRepository.findOneBy({id});

        if(!book){
            throw new NotFoundException(`Book with id ${id} not found`);
        }

        book.status = status;
        return this.bookRepository.save(book);
    }

    async searchBooks(dto:Partial<CreateBookDto>):Promise<Book[]>{
        const where:any = {};

        if(dto.title){
            where.title = Like(`%${dto.title}%`);
        }
        if(dto.author){
            where.author = Like(`%${dto.author}%`);
        }
        if(dto.price){
            where.price = dto.price
        }

        if(dto.status){
            where.status = dto.status
        }

        return this.bookRepository.find({where});
    }
}