import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobsService } from '../../jobs/jobs.service';
import { SortEnum } from '../../shared/sort.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './entities/task.entity';
import { ListTasksResponse } from './responses/list-tasks.response';
import { TaskResponse } from './responses/task.response';
import { ResponsesService } from '../responses/responses.service';

@Injectable()
export class TasksService {

  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    private readonly configService: ConfigService,
    private jobsService: JobsService,
    private httpService: HttpService,
    private responseService: ResponsesService
  ){}
  
  async createTask(createTaskDto: CreateTaskDto, owner: string) {    
    const model = await this.taskModel.create({ ...createTaskDto, owner });
    const response = await this.getTask(model._id.toString());

    await this.startTask(response.payload);
    return response;
  }

  async listTasks(
    limit = this.configService.get<number>('PAGE_LIMIT'),
    offset = 0,
    sort = SortEnum.desc,
    search = '',
    owner?: string
  ) {
    const query: any = {
      $or: [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ]
    };

    if (owner) {
      query.owner = owner
    }

    const tasks = await this.taskModel.find(query)
      .sort({ 'createdAt': sort })
      .limit(limit)
      .skip(offset * limit);
      
    return { success: true, payload: tasks.map(task => Task.toResponse(task)) } as ListTasksResponse;
  }

  async getTask(id: string) {        
    const task = await this.taskModel.findById(id); 
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    
    return { success: true, payload: Task.toResponse(task) } as TaskResponse;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.getTask(id);
    await this.taskModel.findOneAndUpdate({ _id: id }, updateTaskDto);
    
    return { success: true, payload: { ...task.payload, ...updateTaskDto }} as TaskResponse;
  }

  async removeTask(id: string) {
    await this.getTask(id);
    await this.taskModel.findOneAndDelete({ _id: id });

    await this.responseService.clearResponses(id);
    return { success: true };
  }

  async startTask(task: Task){
    if (!task.active) {
      return;
    }    

    this.jobsService.createJob(
      task._id, 
      task.when, 
      () => {        
        this.httpService[task.method](task.uri).subscribe({
          next: response => {            
            this.responseService.createResponse({
              task: task._id,
              error: undefined,
              body: response.data,
              status: response.status
            })
          },
          error: response => {
            this.responseService.createResponse({
              task: task._id,
              error: response.cause,
              body: response.data,
              status: response.status
            })
          }
        });
      }
    );
  }

  async clearTaskResponses(id: string){
    await this.getTask(id);
    return this.responseService.clearResponses(id);
  }
}
