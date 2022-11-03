import * as Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';

export const IdValidator = (name = 'id') => Joi.string()
.required()
.length(uuidv4().length)
.error(() => {
  return new Error(`"${name}" is not a valid uuid`)
});
