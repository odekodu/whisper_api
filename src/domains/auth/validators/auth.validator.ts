import * as Joi from 'joi';
import { AccessRights } from '../../../shared/access.right';

export const AuthValidator = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required()
});
