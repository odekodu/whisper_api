import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, CacheKey, Query } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SortEnum } from '../../shared/sort.enum';
import { RedisCacheKeys } from '../../redis-cache/redis-cache.keys';
import { AuthorizeGuard } from '../../guards/authorize.guard';
import { JoiValidationPipe } from '../../pipes/joi-validation.pipe';
import * as Joi from 'joi';
import { ListResponsesResponse } from './responses/list-responses.response';
import { ResponseResponse } from './responses/response.response';
import { ErrorResponse } from '../../errors/error.response';
import { IdValidator } from '../../shared/id.validator';


@Controller('responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @ApiQuery({ name: 'limit', required: false, description: 'The max number of users to fetch', type: Number })
  @ApiQuery({ name: 'offset', required: false, description: 'The page number to fetch', type: Number })
  @ApiQuery({ name: 'sort', required: false, description: 'The order of sorting', enum: SortEnum, type: String })
  @ApiQuery({ name: 'task', required: false, description: 'The task that created the response', type: String })
  @ApiResponse({ status: HttpStatus.OK, type: ListResponsesResponse })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorResponse })
  @UseGuards(AuthorizeGuard)
  @CacheKey(RedisCacheKeys.LIST_RESPONSES)
  @Get()
  listResponses(
    @Query('task', new JoiValidationPipe(Joi.string().default(''))) task: string,
    @Query('limit', new JoiValidationPipe(Joi.number().min(1))) limit?: number,
    @Query('offset', new JoiValidationPipe(Joi.number().min(0))) offset?: number,
    @Query('sort', new JoiValidationPipe(Joi.string().valid(...Object.values(SortEnum)))) sort?: SortEnum
  ) {
    return this.responsesService.listResponses(task, limit, offset, sort);
  }

  @ApiParam({ name: 'id', required: true, description: 'The id of the response' })
  @ApiResponse({ status: HttpStatus.OK, type: ResponseResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ErrorResponse })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: ErrorResponse })
  @UseGuards(AuthorizeGuard)
  @CacheKey(RedisCacheKeys.GET_RESPONSE)
  @Get(':id')
  getResponse(@Param('id', new JoiValidationPipe(IdValidator('id'))) id: string) {
    return this.responsesService.getResponse(id);
  }
}
