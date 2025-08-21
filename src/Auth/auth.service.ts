import { Repository } from 'typeorm';
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/Users/user.entity";
import { SignUpDto } from './dtos/signup-dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dtos/signin-dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService{
    constructor(
        @InjectRepository(User)
        private readonly authRepository:Repository<User>,
        private readonly jwtService:JwtService,
    ){}

    async signUp(dto:SignUpDto):Promise<User>{
        const {name,email,password} = dto;
        const existingUser = await this.authRepository.findOne({where:{email}});
        if(existingUser){
            throw new BadRequestException("Email is Already in Use");
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await this.authRepository.create({
            name,
            email,
            password:hashedPassword,
        });

        return this.authRepository.save(user);
    }

    async signIn(dto:SignInDto):Promise<{access_token:string}>{
        const {email,password} = dto; 

        const user = await this.authRepository.findOne({where:{email}});
        if(!user){
            throw new UnauthorizedException("invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            throw new UnauthorizedException("invalid credentials");
        }

        const payload = {sub:user.id,email:user.email};
        const token = await this.jwtService.signAsync(payload);

        return {access_token:token};
    }
}