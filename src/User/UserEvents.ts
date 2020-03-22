import { User } from "./User";

export interface IUserEventData {
    user: User;
}

export enum UserEvents {
    REGISTER = 'user::register',
    USER_ACTIVATION = 'user::activation',
    USER_DEACTIVATION = 'user::deactivation',
    USER_INVALIDATION = 'user::invalidation',
    USER_VALIDATION = 'user::validation'
}
