import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { Book } from "src/Books/book.entity";

@Module({
    imports:[TypeOrmModule.forFeature([User,Book])],
    providers:[UsersService],
    controllers:[UsersController],
    exports:[UsersService],
})
export class UsersModule{}