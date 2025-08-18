import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Book } from "./book.entity";
import { BooksControllers } from "./books.controller";
import { BooksService } from "./books.service";

@Module({
    imports:[TypeOrmModule.forFeature([Book])],
    providers:[BooksService],
    controllers:[BooksControllers],
})
export class BooksModule{}