import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/Users/user.entity";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./jwt.strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports:[TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot({isGlobal:true}),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
        imports:[ConfigModule],
        inject:[ConfigService],
        useFactory: (configService:ConfigService) => ({
        secret:configService.get<string>('JWT_SECRET'),
        signOptions:{expiresIn:configService.get<string>('JWT_EXPIRES')},
        }), 
    }),
],
    providers:[AuthService,JwtStrategy],
    controllers:[AuthController],
    exports:[JwtModule],
})
export class AuthModule{}