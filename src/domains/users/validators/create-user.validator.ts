import * as Joi from 'joi';
import { AccessRights } from '../../../shared/access.right';

const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}$/m;

export const CreateUserValidator = Joi.object({
  email: Joi.string().required().email(),
  phone: Joi.string().required().regex(phoneRegex).error((e) => {    
    return new Error('"phone" must be a valid phone number')
  }),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  right: Joi.string().valid(...Object.values(AccessRights))
});
