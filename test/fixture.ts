import { Collection, Connection } from 'mongoose';
import { createUserStub } from './stubs/user.stubs';
import { v4 as uuidv4 } from 'uuid';
import { RedisCacheKeys } from '../src/redis-cache/redis-cache.keys';
import { RedisCacheService } from '../src/redis-cache/redis-cache.service';
import { User } from '../src/domains/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';
import { Task } from '../src/domains/tasks/entities/task.entity';
import { createTaskStub } from './stubs/task.stubs';
import { createResponseStub } from './stubs/response.stubs';
import { Response } from '../src/domains/responses/entities/response.entity';

export class Fixture {
  readonly userCollection: Collection;
  readonly taskCollection: Collection;
  readonly responseCollection: Collection;

  readonly password = '12345';

  constructor(
    private connection: Connection,
    private redisCacheService: RedisCacheService,
    private configService: ConfigService
  ){
    this.userCollection = this.connection.collection('users');
    this.taskCollection = this.connection.collection('tasks');
    this.responseCollection = this.connection.collection('responses');
  }

  async createUser(data: Partial<User> = {}){
    const id = uuidv4();
    const createdAt = new Date();
    const updatedAt = new Date();

    await this.userCollection.insertOne({ ...createUserStub, ...data, _id: id as any, createdAt, updatedAt, hidden: false });
    const user = await this.userCollection.findOne({ _id: id });

    return user;
  }

  async requestPassword(email: string) {
    const key = `${RedisCacheKeys.AUTH_PASS}:${email}`;
    await this.redisCacheService.set(key, this.password, 5 * 60);

    const code = await this.redisCacheService.get(`${RedisCacheKeys.AUTH_PASS}:${email}`);
  }

  async login(user: { _id: string, email: string}) {
    await this.requestPassword(user.email);
    const token = sign(user._id, this.configService.get('SECRET'));
    return token;
  }

  async createTask(user: User, data: Partial<Task> = {}){
    const id = uuidv4();
    const createdAt = new Date();
    const updatedAt = new Date();

    await this.taskCollection.insertOne({ ...createTaskStub, ...data, _id: id as any, createdAt, updatedAt, owner: user._id });
    const task = await this.taskCollection.findOne({ _id: id });

    return task;
  }

  async createResponse(user: User, task?: Task, data: Partial<Response> = {}){
    const id = uuidv4();
    const createdAt = new Date();
    const updatedAt = new Date();

    const taskId = task ? task._id : (await this.createTask(user))._id;
    await this.responseCollection.insertOne({ ...createResponseStub(taskId.toString()), ...data, _id: id as any, createdAt, updatedAt });

    const response = await this.responseCollection.findOne({ _id: id })
    return response;
  }
}