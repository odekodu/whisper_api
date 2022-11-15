import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ApiResponse, PickType } from '@nestjs/swagger';
import { ErrorResponse } from '../../errors/error.response';
import { JoiValidationPipe } from '../../pipes/joi-validation.pipe';
import { AuthService } from './auth.service';
import { AuthSchema } from './entities/auth.schema';
import { AuthValidator } from './validators/auth.validator';
import { LoginResponse } from './responses/login.response';
import { ResponseSchema } from '../../shared/response.schema';
import * as Joi from 'joi';
import { LimitRequestsGuard } from '../../guards/limit-requests.guard';
import { CacheFilter } from '../../decorators/cache-filter.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ErrorResponse })
  @ApiResponse({ status: HttpStatus.OK, type: PickType(ResponseSchema, ['success', 'timestamp', 'message']) })
  @CacheFilter()
  @UseGuards(LimitRequestsGuard)
  @Get(':email')
  request(
    @Param('email', new JoiValidationPipe(Joi.string().email().required())) email: string
  ){
    return this.authService.request(email);
  }

  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ErrorResponse })
  @ApiResponse({ status: HttpStatus.CREATED, type: LoginResponse })
  @UsePipes(new JoiValidationPipe(AuthValidator))
  @Post()
  login(
    @Body() auth: AuthSchema
  ){
    return this.authService.login(auth);
  }
}
