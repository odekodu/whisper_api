import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AccessRights } from 'src/shared/access.right';
import { AuthService } from '../domains/auth/auth.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private roles: AccessRights[]
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { right } = request.user; 
    
    if (!this.roles.includes(right)) {
      throw new HttpException('You are not authorized', HttpStatus.UNAUTHORIZED);
    }
    
    return true;
  }
}
