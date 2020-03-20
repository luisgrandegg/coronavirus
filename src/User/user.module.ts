import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './User';
import { UserRepository } from './user.repository';

@Module({
    exports: [
        UserService
    ],
    imports: [
        TypeOrmModule.forFeature([User, UserRepository])
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
