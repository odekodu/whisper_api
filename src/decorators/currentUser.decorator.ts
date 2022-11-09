import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator((data: any, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();  
  const value = data ? request.user[data] : request.user;  
  return value;
});
