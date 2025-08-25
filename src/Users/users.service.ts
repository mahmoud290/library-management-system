import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dtos/create-user-dto";
import { Book } from "src/Books/book.entity";

@Injectable()
export class UsersService{
constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,

    @InjectRepository(Book)
    private readonly bookRepository:Repository<Book>,
){}

async createUser(dto:CreateUserDto):Promise<User>{
    const user = await this.userRepository.create(dto);
    return this.userRepository.save(user);
}

async findAll(page:number,limit:number){
    const[data,total] = await this.userRepository.findAndCount({
        skip:(page - 1) * limit,
        take:limit,
    });

    return {
        data,
        total,
        page,
        limit,
        totalPages : Math.ceil(total/limit),
    };
}

async findOne(id:number):Promise<User>{
    const user = await this.userRepository.findOneBy({id});

    if(!user){
        throw new NotFoundException(`User With id ${id} not found`);
    }
    return user;
}
async updateUser(id:number , dto:Partial<CreateUserDto>):Promise<User>{
    const user = await this.userRepository.findOneBy({id});

    if(!user){
        throw new NotFoundException(`User With id ${id} not found`);
    }

    this.userRepository.merge(user,dto)
    return this.userRepository.save(user);
}

async deleteUser(id:number):Promise<{message:string}>{
    const result = await this.userRepository.delete(id);

    if(result.affected === 0){
        throw new NotFoundException(`User with id ${id} not found`);
    }
    return {message:`User with id ${id} deleted successfully`};
}

async applyToBook(userId:number,bookId:number):Promise<{message:string}>{
    const user = await this.userRepository.findOne({
        where:{id:userId},
        relations:['books'],
    });
    if(!user){
        throw new NotFoundException(`User with id ${userId} not found `);
    }

    const book = await this.bookRepository.findOneBy({id:bookId})
    if(!book){
        throw new NotFoundException(`Book with id ${bookId} not found`);
    }

    if(user.books.some((b)=> b.id === book.id)){
        return {message:`User ${user.name} already applied to book "${book.title}"`};
    }
    
    user.books.push(book);
    await this.userRepository.save(user);

    return {message:`User ${user.name} has Successfully applied to book "${book.title}"`}
}
}