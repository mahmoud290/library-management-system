import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Borrow } from "./borrow.entity";
import { BorrowsController } from "./borrow.controller";
import { BorrowsService } from "./borrow.service";
import { BooksModule } from "src/Books/books.module";

@Module({
    imports:[TypeOrmModule.forFeature([Borrow]),
    BooksModule,
],
    providers:[BorrowsService],
    controllers:[BorrowsController],
})
export class BorrowsModule{}