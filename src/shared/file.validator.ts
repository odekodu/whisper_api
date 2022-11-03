import * as Joi from 'joi';

export const FileValidator = {
  One: Joi.any()
  .required()
  .error(() => {
    return new Error('"file" is not valid')
  }),
  Many: Joi.array()
  .required()
  .min(1)
  .max(10)
  .error(() => {
    return new Error('"files" are not valid')
  })
};
