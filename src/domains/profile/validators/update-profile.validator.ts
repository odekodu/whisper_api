import * as Joi from 'joi';
import { AccessRights } from '../../../shared/access.right';

const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}$/m;

export const UpdateProfileValidator = Joi.object({
  email: Joi.string().email(),
  phone: Joi.string().regex(phoneRegex).error((e) => {    
    return new Error('"phone" must be a valid phone number')
  }),
  firstname: Joi.string(),
  lastname: Joi.string(),
  wallet: Joi.string()
});
