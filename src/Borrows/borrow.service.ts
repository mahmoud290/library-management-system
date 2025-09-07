import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Borrow, BorrowStatus } from "./borrow.entity";
import { Repository } from "typeorm";
import { CreateBorrowDto } from "./dtos/create-borrow-dto";
import { Book } from "../Books/book.entity";

@Injectable()
export class BorrowsService{
    constructor(
        @InjectRepository(Borrow)
        private readonly borrowRepository:Repository<Borrow>,

        @InjectRepository(Book)
        private readonly bookRepository:Repository<Book>
    ){}

    async createBorrow(dto:CreateBorrowDto):Promise<Borrow>{
        const book = await this.bookRepository.findOne({where:{id:dto.bookId}});

        if(!book){
            throw new NotFoundException(`Book with ID ${dto.bookId} not found`);
        }

        const activeBorrow = await this.borrowRepository.findOne({
            where:{bookId:dto.bookId,status:BorrowStatus.BORROWED},
        });

        if (activeBorrow) {
    throw new BadRequestException(`Book with ID ${dto.bookId} is already borrowed`);
        }
        const borrow = this.borrowRepository.create(dto);
        return this.borrowRepository.save(borrow);
    }

    async findAll(page:number, limit:number){
    const[data,total] = await this.borrowRepository.findAndCount({
        skip:(page - 1) * limit,
        take:limit,
    });

    return {
        data,
        total,
        page,
        limit,
        totalPages:Math.ceil(total/limit),
    };
    }

    async getByID(userId:number):Promise<Borrow>{
        const borrow = await this.borrowRepository.findOneBy({userId});
        if(!borrow){
            throw new NotFoundException(`Borrow with id ${userId} not found`);
        }
        return borrow;
    }

    async updateBorrow(id:number , dto:Partial<CreateBorrowDto>):Promise<Borrow>{
        const borrow = await this.borrowRepository.findOneBy({id});
        if(!borrow){
            throw new NotFoundException(`Borrow with id ${id} not found`);
        }
        this.borrowRepository.merge(borrow,dto)
        return this.borrowRepository.save(borrow);
    }

    async deleteBorrow(id:number):Promise<{message:string}>{
        const result = await this.borrowRepository.delete(id);

        if(result.affected === 0){
            throw new NotFoundException(`Borrow with id ${id} not found`);
        }
        return {message:`Borrow with id ${id} deleted Successfully`};
    }

    async findByUserId(userId:number):Promise<Borrow[]>{
        return this.borrowRepository.find({
            where:{userId},
            relations:["book"]
        });
    }
}