import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './Books/books.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './Users/users.module';
import { BorrowsModule } from './Borrows/borrow.module';
import { AuthModule } from './Auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory :(configService:ConfigService) => ({ 
      type:'postgres',
      host:configService.get<string>('DB_HOST'),
      port:Number(configService.get<string>('DB_PORT')),
      username:configService.get<string>('DB_USERNAME'),
      password:configService.get<string>('DB_PASSWORD'),
      database:configService.get<string>('DB_NAME'),
      autoLoadEntities: true,
      synchronize:true,
      }),
    }),
    BooksModule,
    UsersModule,
    BorrowsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
