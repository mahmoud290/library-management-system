import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/Users/user.entity";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports:[TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot({isGlobal:true}),
    JwtModule.registerAsync({
        imports:[ConfigModule],
        inject:[ConfigService],
        useFactory: (configService:ConfigService) => ({
        secret:configService.get<string>('JWT_SECRET'),
        signOptions:{expiresIn:configService.get<string>('JWT_EXPIRES')},
        }), 
    }),
],
    providers:[AuthService],
    controllers:[AuthController],
})
export class AuthModule{}