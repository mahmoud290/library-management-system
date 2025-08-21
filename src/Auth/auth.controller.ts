import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dtos/signup-dto";
import { User } from "src/Users/user.entity";
import { SignInDto } from "./dtos/signin-dto";

@Controller('auth')
export class AuthController{
    constructor(private readonly authService:AuthService){}

    @Post('signup')
    async signup(@Body() dto:SignUpDto):Promise<User>{
        return this.authService.signUp(dto); 
    }

    @Post('signin')
    async signin(@Body() dto:SignInDto):Promise<{access_token:string}>{
        return this.authService.signIn(dto);
    }
}