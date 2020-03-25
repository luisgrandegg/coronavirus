import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as PubSub from 'pubsub-js';

import { User } from './User';
import { UserRepository } from './user.repository';
import { IRegisterUserDto } from '../dto/RegisterUserDto';
import { UserDoesntExistsError } from './UserDoesntExistsError';
import { ObjectId } from 'mongodb';
import { UserListParams } from '../dto/UserListParams';
import { UserEvents } from './UserEvents';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {}

    async save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async getUserById(userId: string): Promise<User> {
        return this.userRepository.findById(userId);
    }

    async getUserByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ email });
    }

    async get(userListParams?: UserListParams): Promise<User[]> {
        if (!userListParams) {
            return this.userRepository.find();
        }

        return this.userRepository.find({
            where: { ...userListParams.toJSON() },
            order: {
                createdAt: 1
            }
        });
    }

    async findByIds(userIds: ObjectId[], userListParams?: UserListParams): Promise<User[]> {
        return this.userRepository.findByIds(userIds, { ...userListParams.toJSON() });
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
        user.isActive = true;
        user.doctorType = registerUserDto.doctorType;
        return this.userRepository.save(user)
            .then((user: User) => {
                PubSub.publish(UserEvents.REGISTER, { user });
                return user;
            });
    }

    async validate(id: string): Promise<User> {
        return this.userRepository.findOne(id)
            .then(async (user: User) => {
                if (!user) {
                    throw new UserDoesntExistsError();
                }
                user.isValidated = true;
                return this.userRepository.save(user)
                    .then(() => {
                        PubSub.publish(UserEvents.USER_VALIDATION, { user });
                        return user;
                    });
            });
    }

    async invalidate(id: string): Promise<User> {
        return this.userRepository.findOne(id)
            .then((user: User) => {
                if (!user) {
                    throw new UserDoesntExistsError();
                }
                user.isValidated = false;
                return this.userRepository.save(user)
                    .then(() => {
                        PubSub.publish(UserEvents.USER_INVALIDATION, user);
                        return user;
                    });
            });
    }

    async activate(id: string): Promise<User> {
        return this.userRepository.findOne(id)
            .then((user: User) => {
                if (!user) {
                    throw new UserDoesntExistsError();
                }
                user.isActive = true;
                return this.userRepository.save(user)
                    .then(() => {
                        PubSub.publish(UserEvents.USER_ACTIVATION, user);
                        return user;
                    });
            });
    }

    async deactivate(id: string): Promise<User> {
        return this.userRepository.findOne(id)
            .then((user: User) => {
                if (!user) {
                    throw new UserDoesntExistsError();
                }
                user.isActive = false;
                return this.userRepository.save(user)
                    .then(() => {
                        PubSub.publish(UserEvents.USER_DEACTIVATION, user);
                        return user;
                    });
            });
    }
}
