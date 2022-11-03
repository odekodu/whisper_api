import { Body, Controller, Delete, Get, HttpStatus, Patch, Put, UploadedFile, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { ApiHeader, ApiResponse, PickType } from '@nestjs/swagger';
import { JoiValidationPipe } from '../../pipes/joi-validation.pipe';
import { CurrentUser } from '../../decorators/currentUser.decorator';
import { ErrorResponse } from '../../errors/error.response';
import { AuthenticationGuard } from '../../guards/authentication.guard';
import { AuthorizeGuard } from '../../guards/authorize.guard';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UsersService } from '../users/users.service';
import { UpdateProfileValidator } from './validators/update-profile.validator';
import { ResponseSchema } from '../../shared/response.schema';
import { NoCache } from '../../decorators/no-cache.decorator';
import { UserResponse } from '../users/responses/user.response';
import { Storage } from '../../shared/storage';
import { FileValidator } from '../../shared/file.validator';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @ApiHeader({ name: 'token', required: true }) 
  @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorResponse })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorResponse })
  @UseGuards(AuthorizeGuard)
  @NoCache()
  @Get()
  getProfile(
    @CurrentUser('_id') id: string
  ) {
    return this.usersService.getUser(id);
  }

  @ApiHeader({ name: 'token', required: true })
  @ApiHeader({ name: 'password', required: true })
  @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ErrorResponse })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorResponse })
  @UseGuards(AuthorizeGuard, AuthenticationGuard)
  @Patch()
  updateProfile(
    @Body(new JoiValidationPipe(UpdateProfileValidator)) updateUserDto: UpdateUserDto,
    @CurrentUser('_id') id: string
  ) {    
    return this.usersService.updateUser(id, updateUserDto);
  }

  @ApiHeader({ name: 'token', required: true })
  @ApiHeader({ name: 'password', required: true })
  @ApiResponse({ status: HttpStatus.OK, type: PickType(ResponseSchema, ['success']) })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorResponse })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorResponse })
  @UseGuards(AuthorizeGuard, AuthenticationGuard)
  @Delete()
  removeProfie(
    @CurrentUser('_id') id: string,
  ){
    return this.usersService.removeUser(id);
  }

  @ApiHeader({ name: 'token', required: true })
  @ApiResponse({ status: HttpStatus.OK, type: PickType(ResponseSchema, ['success']) })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorResponse })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorResponse })
  @UseGuards(AuthorizeGuard)
  @UseInterceptors(Storage.upload('image', 1))
  @Patch('image')
  uploadImage(
    @UploadedFile(new JoiValidationPipe(FileValidator.One)) file: any,
    @CurrentUser('_id') id: string,
    @Body() body
  ){    
    return this.usersService.uploadImage(id, file);
  }
}
