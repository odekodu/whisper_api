import * as Joi from 'joi';
import { TaskMethodEnum } from '../../../shared/task_method.enum';

export const UpdateTaskValidator = Joi.object({
  title: Joi.string(),
  uri: Joi.string().uri(),
  method: Joi.string().valid(...Object.values(TaskMethodEnum)),
  times: Joi.array().items(Joi.string()),
  active: Joi.boolean(),
  description: Joi.string(),
  body: Joi.object(),
  auth: Joi.object({
    user: Joi.string().required(),
    password: Joi.string().required()
  })
});
