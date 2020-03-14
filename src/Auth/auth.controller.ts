import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';

import { AuthService } from './auth.service';
import { Auth } from './Auth';
import { ILoginDto, LoginDto } from '../dto/LoginDto';
import { RegisterDoctorDto, IRegisterDoctorDto } from '../dto/RegisterDoctorDto';
import { Doctor } from '../Doctor';
import { UserExistsError } from '../User/UserExistsError';
import { UserDoesntExistsError } from '../User/UserDoesntExistsError';
import { AuthError } from './AuthError';
import { ValidationError } from '../ValidationError';

export enum Routes {
    LOGIN = '/login',
    REGISTER_DOCTOR = '/register/doctor',
}

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post(Routes.LOGIN)
    async login(
        @Body() body: ILoginDto
    ): Promise<Auth> {
        const loginRequestDto = LoginDto.createFromRequest(body);
        return this.authService.login(loginRequestDto)
            .catch((error: Error) => {
                if (error instanceof UserDoesntExistsError) {
                    throw new HttpException({
                        message: error.message,
                        key: error.key
                    }, HttpStatus.UNAUTHORIZED);
                }
                if (error instanceof AuthError) {
                    throw new HttpException({
                        message: error.message,
                        key: error.key
                    }, HttpStatus.UNAUTHORIZED);
                }
                throw error;
            });
    }

    @Post(Routes.REGISTER_DOCTOR)
    async registerDoctor(
        @Body() body: IRegisterDoctorDto
    ): Promise<Doctor> {
        const registerDoctorDto = RegisterDoctorDto.createFromRequest(body);

        if (registerDoctorDto.password !== registerDoctorDto.confirmPassword) {
            throw new HttpException({
                message: 'ValidationError',
                key: 'VALIDATION_ERROR',
                validationErrors: [
                    {
                        property: 'password',
                    }
                ]
            }, HttpStatus.BAD_REQUEST);
        }

        if (!registerDoctorDto.terms) {
            throw new HttpException({
                message: 'ValidationError',
                key: 'VALIDATION_ERROR',
                validationErrors: [
                    {
                        property: 'terms',
                    }
                ]
            }, HttpStatus.BAD_REQUEST);
        }

        if (!registerDoctorDto.privacy) {
            throw new HttpException({
                message: 'ValidationError',
                key: 'VALIDATION_ERROR',
                validationErrors: [
                    {
                        property: 'privacy',
                    }
                ]
            }, HttpStatus.BAD_REQUEST);
        }

        return this.authService.registerDoctor(registerDoctorDto)
            .catch((error: Error) => {
                if (error instanceof UserExistsError) {
                    throw new HttpException({
                        message: error.message,
                        key: error.key
                    }, HttpStatus.BAD_REQUEST);
                }
                if (error instanceof ValidationError) {
                    throw new HttpException({
                        message: error.message,
                        key: error.key,
                        validationErrors: error.validationErrors
                    }, HttpStatus.BAD_REQUEST)
                }
                throw error;
            });
    }
}
