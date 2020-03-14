import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Auth } from './Auth';
import { UserService, User } from '../User';
import { LoginDto } from '../dto/LoginDto';
import { RegisterDoctorDto } from '../dto/RegisterDoctorDto';
import { DoctorService, Doctor } from '../Doctor';
import { AuthError } from './AuthError';
import { UserDoesntExistsError } from '../User/UserDoesntExistsError';
import { UserExistsError } from '../User/UserExistsError';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Auth)
        private authRepository: Repository<Auth>,
        private userService: UserService,
        private doctorService: DoctorService
    ) {}

    async getByToken(authorizationToken: string): Promise<Auth> {
        if (!authorizationToken) {
            throw new AuthError();
        }

        return this.authRepository
            .findOne({
                token: authorizationToken.split('Bearer ')[1]
            })
            .then((authorization: Auth) => {
                if (!authorization) {
                    throw new AuthError();
                }

                return authorization;
            });
    }

    async login(
        loginDto: LoginDto,
        verifyPassword: boolean = true,
    ): Promise<Auth> {
        const user: User = await this.userService.getUserByEmail(loginDto.email)
            .then((dbUser: User) => {
                if (!dbUser) {
                    throw new UserDoesntExistsError();
                }

                return dbUser;
            })
            .then((dbUser: User) => {
                if (
                    (verifyPassword && !dbUser.verifyPassword(loginDto.password)) ||
                    !dbUser.isValidated
                ) {
                    throw new AuthError();
                }

                return dbUser;
            });

        return this.authRepository.findOne({
                userId: user.id
            })
            .then((authorization: Auth) => {
                if (authorization) {
                    return this.authRepository.remove(authorization);
                }
            })
            .then(() => {
                const authorization = new Auth();
                authorization.userId = user.id;
                authorization.userType = user.type;

                return this.authRepository.save(authorization);
            });
    }

    async logout(token: string): Promise<void> {
        return this.authRepository.findOne({
                token: token
            })
            .then((authorization: Auth) => {
                if (authorization) {
                    this.authRepository.remove(authorization);
                }
            });
    }

    async registerDoctor(registerDoctorDto: RegisterDoctorDto): Promise<Doctor> {
        return this.userService.getUserByEmail(registerDoctorDto.email)
            .then((user: User) => {
                if (user) {
                    throw new UserExistsError();
                }
            })
            .then(() => this.userService.register(registerDoctorDto)
            .then((user: User) => this.doctorService.create(registerDoctorDto, { userId: user.id})));
    }
}
