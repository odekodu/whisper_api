import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobsService } from '../../jobs/jobs.service';
import { RedisCacheKeys } from '../../redis-cache/redis-cache.keys';
import { RedisCacheService } from '../../redis-cache/redis-cache.service';
import { SortEnum } from '../../shared/sort.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './entities/task.entity';
import { ListTasksResponse } from './responses/list-tasks.response';
import { TaskResponse } from './responses/task.response';

@Injectable()
export class TasksService {

  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    private readonly configService: ConfigService,
    private redisCacheService: RedisCacheService,
    private jobsService: JobsService,
    private httpService: HttpService
  ){}
  
  async createTask(createTaskDto: CreateTaskDto, owner: string) {    
    const model = await this.taskModel.create({ ...createTaskDto, owner });
    const response = await this.getTask(model._id as string);

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
    const user = await this.taskModel.findById(id); 
    return { success: true, payload: user } as TaskResponse;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.getTask(id);
    await this.taskModel.findOneAndUpdate({ _id: id }, updateTaskDto);

    await this.redisCacheService.del(`${RedisCacheKeys.GET_TASK}`);
    await this.redisCacheService.del(`${RedisCacheKeys.LIST_TASKS}`, true);    
    
    return { success: true, payload: { ...task.payload, ...updateTaskDto }} as TaskResponse;
  }

  async removeTask(id: string) {
    await this.getTask(id);
    await this.taskModel.findOneAndDelete({ _id: id });

    await this.redisCacheService.del(`${RedisCacheKeys.GET_TASK}`);
    await this.redisCacheService.del(`${RedisCacheKeys.LIST_TASKS}`, true);

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
        this.httpService[task.method](task.uri).subscribe(response => {
          console.log(response);
        });
      }
    );
  }
}
