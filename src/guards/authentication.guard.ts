import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../domains/auth/auth.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private authService?: AuthService
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { password } = request.headers;
    if (!password) throw new HttpException('You are not authorized', HttpStatus.UNAUTHORIZED);
    
    const { email } = request.user;    
    await this.authService.authenticate({ email, password});        

    return true;
  }
}
