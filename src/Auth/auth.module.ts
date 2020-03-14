import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth } from './Auth';
import { UserModule } from '../User';
import { DoctorModule } from '../Doctor';

@Module({
    exports: [
        AuthService
    ],
    imports: [
        TypeOrmModule.forFeature([Auth]),
        DoctorModule,
        UserModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
