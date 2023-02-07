import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { decode, sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { MailEnum } from '../../mail/mail.enum';
import { MailService } from '../../mail/mail.service';
import { RedisCacheKeys } from '../../redis-cache/redis-cache.keys';
import { RedisCacheService } from '../../redis-cache/redis-cache.service';
import { UsersService } from '../users/users.service';
import { AuthSchema } from './entities/auth.schema';
import { LoginResponse } from './responses/login.response';


@Injectable()
export class AuthService {
  constructor(
    private readonly redisCacheService: RedisCacheService,
    private readonly mailService: MailService,
    private configService: ConfigService,
    private userService: UsersService
  ){}

  async request(email: string) {    
    const user = (await this.userService.findByEmail(email));        
    const password = Math.floor(Math.random() * 100000);    

    const key = `${RedisCacheKeys.AUTH_PASS}:${user.email}`;
    await this.redisCacheService.set(key, password, 5 * 60);

    await this.mailService.sendMail({
      to: user.email,
      subject: 'OTP Request',
      template: MailEnum.OTP,
      context: {
        password,
        name: user.firstname
      }
    });
    
    return { success: true, message: 'Your OTP has been sent to your mail' };
  }

  async login(auth: AuthSchema){
    const user = (await this.userService.findByEmail(auth.email));
    await this.authenticate(auth);
    const token = sign(user._id, this.configService.get('SECRET'));
    
    return { success: true, payload: token } as LoginResponse;
  }

  async authenticate(auth: AuthSchema){
    const code = await this.redisCacheService.get<string>(`${RedisCacheKeys.AUTH_PASS}:${auth.email}`);   
    
    if(code?.toString() !== auth.password){
      throw new HttpException('Wrong password, please try again', HttpStatus.UNAUTHORIZED);
    }
  }

  async decode(token: string){    
    const id = decode(token, this.configService.get('SECRET')) as unknown as string;
    if (!id) throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        
    const user = await this.userService.findById(id);
    return user;
  }
}
