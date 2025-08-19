import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Borrow } from "./borrow.entity";
import { BorrowsController } from "./borrow.controller";
import { BorrowsService } from "./borrow.service";

@Module({
    imports:[TypeOrmModule.forFeature([Borrow])],
    providers:[BorrowsService],
    controllers:[BorrowsController],
})
export class BorrowsModule{}