import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UsePipes, CacheKey, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiHeader, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ErrorResponse } from '../../errors/error.response';
import { JoiValidationPipe } from '../../pipes/joi-validation.pipe';
import { TaskResponse } from './responses/task.response';
import { CreateTaskValidator } from './validators/create-task.validator';
import { SortEnum } from '../../shared/sort.enum';
import { ListTasksResponse } from './responses/list-tasks.response';
import { RedisCacheKeys } from '../../redis-cache/redis-cache.keys';
import * as Joi from 'joi';
import { IdValidator } from '../../shared/id.validator';
import { UpdateTaskValidator } from './validators/update-task.validator';
import { AuthorizeGuard } from '../../guards/authorize.guard';
import { CurrentUser } from '../../decorators/currentUser.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiHeader({ name: 'token', required: true }) 
  @ApiResponse({ status: HttpStatus.CREATED, type: TaskResponse})
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ErrorResponse })
  @ApiResponse({ status: HttpStatus.CONFLICT, type: ErrorResponse })
  @UseGuards(AuthorizeGuard)
  @Post()
  createTask(
    @Body(new JoiValidationPipe(CreateTaskValidator)) createTaskDto: CreateTaskDto,
    @CurrentUser('_id') id: string
  ) {        
    return this.tasksService.createTask(createTaskDto, id);
  }

  @ApiQuery({ name: 'limit', required: false, description: 'The max number of users to fetch', type: Number })
  @ApiQuery({ name: 'offset', required: false, description: 'The page number to fetch', type: Number })
  @ApiQuery({ name: 'sort', required: false, description: 'The order of sorting', enum: SortEnum, type: String })
  @ApiQuery({ name: 'search', required: false, description: 'The string to search for', type: String })
  @ApiQuery({ name: 'owner', required: false, description: 'The owner tasks to list', type: String })
  @ApiResponse({ status: HttpStatus.OK, type: ListTasksResponse })
  @UseGuards(AuthorizeGuard)
  @CacheKey(RedisCacheKeys.LIST_TASKS)
  @Get()
  listTasks(
    @Query('limit', new JoiValidationPipe(Joi.number().min(1))) limit?: number,
    @Query('offset', new JoiValidationPipe(Joi.number().min(0))) offset?: number,
    @Query('sort', new JoiValidationPipe(Joi.string().valid(...Object.values(SortEnum)))) sort?: SortEnum,
    @Query('search', new JoiValidationPipe(Joi.string().default(''))) search?: string,
    @Query('owner', new JoiValidationPipe(Joi.string().default(''))) owner?: string
  ) {
    return this.tasksService.listTasks(limit, offset, sort, search, owner);
  }

  @ApiParam({ name: 'id', required: true, description: 'The id of the user' })
  @ApiResponse({ status: HttpStatus.OK, type: TaskResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorResponse })
  @UseGuards(AuthorizeGuard)
  @CacheKey(RedisCacheKeys.GET_USER)
  @Get(':id')
  getUser(
    @Param('id', new JoiValidationPipe(IdValidator())) id: string
  ) {    
    return this.tasksService.getTask(id);
  }

  @ApiParam({ name: 'id', required: true, description: 'The id of the user' })
  @ApiResponse({ status: HttpStatus.OK, type: TaskResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorResponse })
  @UsePipes(new JoiValidationPipe(UpdateTaskValidator))
  @Patch(':id')
  updateTask(
    @Param('id', new JoiValidationPipe(IdValidator())) id: string,
    @Body() updateTaskDto: UpdateTaskDto
  ) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @ApiParam({ name: 'id', required: true, description: 'The id of the user' })
  @ApiResponse({ status: HttpStatus.OK, type: TaskResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorResponse })
  @Delete(':id')
  removeTask(
    @Param('id', new JoiValidationPipe(IdValidator())) id: string,
  ) {
    return this.tasksService.removeTask(id);
  }
}
