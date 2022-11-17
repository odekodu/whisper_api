import { Injectable, NotFoundException } from '@nestjs/common';
import { SortEnum } from '../../shared/sort.enum';
import { CreateResponseDto } from './dto/create-response.dto';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from './entities/response.entity';
import { ResponseSchema } from '../../shared/response.schema';
import { Model } from 'mongoose';
import { ResponseResponse } from './responses/response.response';
import { ListResponsesResponse } from './responses/list-responses.response';

@Injectable()
export class ResponsesService {

  constructor(
    @InjectModel(Response.name) private readonly responseModel: Model<ResponseSchema>,
    private readonly configService: ConfigService,
  ){}

  async createResponse(createResponseDto: CreateResponseDto) {
    const model = await this.responseModel.create(createResponseDto);
    const response = await this.getResponse(model._id.toString());

    return response;
  }

  async listResponses(
    task: string,
    limit = this.configService.get<number>('PAGE_LIMIT'),
    offset = 0,
    sort = SortEnum.desc
  ) {
    const tasks = await this.responseModel.find({
      task
    })
      .sort({ 'createdAt': sort })
      .limit(limit)
      .skip(offset * limit);
      
    return { success: true, payload: tasks.map(task => Response.toResponse(task)) } as ListResponsesResponse;
  }

  async getResponse(id: string) {    
    const response = await this.responseModel.findById(id);     
    if (!response) {
      throw new NotFoundException('Response not found');
    }
    
    return { success: true, payload: Response.toResponse(response) } as ResponseResponse;
  }

  async clearResponses(task: string){
    await this.responseModel.deleteMany({ task });
    return { success: true };
  }
}
