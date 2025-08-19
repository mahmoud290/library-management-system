import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Borrow } from "./borrow.entity";
import { Repository } from "typeorm";
import { CreateBorrowDto } from "./dtos/create-borrow-dto";

@Injectable()
export class BorrowsService{
    constructor(
        @InjectRepository(Borrow)
        private readonly borrowRepository:Repository<Borrow>,
    ){}

    async createBorrow(dto:CreateBorrowDto):Promise<Borrow>{
        const borrow = await this.borrowRepository.create(dto);
        return this.borrowRepository.save(borrow);
    }

    async findAll():Promise<Borrow[]>{
        return this.borrowRepository.find();
    }

    async getByID(id:number):Promise<Borrow>{
        const borrow = await this.borrowRepository.findOneBy({id});
        if(!borrow){
            throw new NotFoundException(`Borrow with id ${id} not found`);
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
}