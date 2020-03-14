import { validate, ValidationError as ClassValidatorValidationError } from 'class-validator';
import { DeepPartial, ObjectLiteral, Repository as TypeormRepository } from 'typeorm';

import { ValidationError } from './ValidationError';

export class Repository<Entity extends ObjectLiteral> extends TypeormRepository<Entity> {
    async save<T extends DeepPartial<Entity>>(entity: T): Promise<T> {
        return validate(entity)
            .then((validationErrors: ClassValidatorValidationError[]) => {
                if (validationErrors.length) {
                    throw new ValidationError(validationErrors);
                }
                return super.save(entity);
            });
    }
}
