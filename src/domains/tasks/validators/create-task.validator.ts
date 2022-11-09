import * as Joi from 'joi';
import { TaskMethodEnum } from '../../../shared/task_method.enum';

export const CreateTaskValidator = Joi.object({
  title: Joi.string().required(),
  uri: Joi.string().required().uri(),
  method: Joi.string().required().valid(...Object.values(TaskMethodEnum)),
  when: Joi.string().required(),
  active: Joi.boolean(),
  description: Joi.string(),
  body: Joi.object(),
  auth: Joi.object({
    user: Joi.string().required(),
    password: Joi.string().required()
  })
});
