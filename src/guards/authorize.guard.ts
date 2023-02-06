import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../domains/auth/auth.service';

@Injectable()
export class AuthorizeGuard implements CanActivate {
  constructor(
    private authService: AuthService,
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    request.user = await this.authorize(request);        
    
    return true;
  }

  async authorize(request: any) {
    const { authorization } = request.headers;    
    if (!authorization) throw new HttpException('You are not authorized', HttpStatus.UNAUTHORIZED);
    
    const [_, token] = authorization.split(' ');    
    return this.authService.decode(token);                    
  }
}
