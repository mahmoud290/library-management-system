import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from 'src/Users/users.service';


@Injectable()
export class JwtStrategy  extends PassportStrategy(Strategy){
    constructor(
        private readonly usersService: UsersService,
        configService:ConfigService
    ){
        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration:false,
            secretOrKey:configService.get<string>('JWT_SECRET') || 'default_secret',
        });
    }
    async validate(payload:any) {
        console.log('JWT Payload:', payload);
        const user = await this.usersService.findOne(Number(payload.sub));
        console.log('Looking for user id:', payload.sub, '=> Found:', user);
        if(!user){
            throw new UnauthorizedException('User not found in request.');
        }
        return user;
    }
}