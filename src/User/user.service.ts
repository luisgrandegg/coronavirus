import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './User';
import { UserRepository } from './user.repository';
import { IRegisterUserDto } from '../dto/RegisterUserDto';
import { UserDoesntExistsError } from './UserDoesntExistsError';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {}

    async getUserById(userId: string): Promise<User> {
        return this.userRepository.findById(userId);
    }

    async getUserByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ email });
    }

    async update(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async register(registerUserDto: IRegisterUserDto): Promise<User> {
        const user = this.userRepository.create();
        user.email = registerUserDto.email;
        user.password = registerUserDto.password;
        user.terms = registerUserDto.terms;
        user.privacy = registerUserDto.privacy;
        user.type = registerUserDto.userType;
        user.isValidated = false;
        return this.userRepository.save(user);
    }

    async validate(id: string): Promise<User> {
        return this.userRepository.findOne(id)
            .then((user: User) => {
                if (!user) {
                    throw new UserDoesntExistsError();
                }
                user.isValidated = true;
                return this.userRepository.save(user);
            });
    }
}
