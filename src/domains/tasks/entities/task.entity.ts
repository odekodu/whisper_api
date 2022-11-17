import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from 'uuid';
import { TaskMethodEnum } from "../../../shared/task_method.enum";
import { Auth } from "../../../shared/auth.interface";
import { CronExpression } from "@nestjs/schedule";

@Schema({ timestamps: true, versionKey: false })
export class Task {

  @ApiProperty({ description: 'The task id' })
  @Prop({ type: String, default: uuidv4 })
  _id?: string;

  @ApiProperty({ description: 'The task owner' })
  @Prop({ type: String, required: [true, "Owner is required"] })
  owner: string;

  @ApiProperty({ description: 'The task title' })
  @Prop({ type: String, required: [true, "Title is required"] })
  title: string;

  @ApiProperty({ description: 'The task uri' })
  @Prop({ required: [true, "URI is required"] })
  uri: string;

  @ApiProperty({ description: 'The task http-method' })
  @Prop({ required: [true, "Method is required"] })
  method: TaskMethodEnum;

  @ApiProperty({ description: 'The time to run the task' })
  @Prop({ type: String, required: [true, "When is required"] })
  when: CronExpression;

  @ApiProperty({ description: 'The task status' })
  @Prop({ default: false })
  active: boolean;

  @ApiProperty({ description: 'The task description' })
  @Prop({ type: String })
  description?: string;

  @ApiProperty({ description: 'The task request body' })
  @Prop({ type: {} })
  body?: any;

  @ApiProperty({ description: 'The task uri authentication' })
  @Prop({ type: {} })
  auth?: Auth;

  @ApiProperty({ description: 'The task creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'The task update date' })
  updatedAt: Date;

  static toResponse(data: any){
    const task = data._doc;    
    return task;
  }
}

export type TaskDocument = Task | Document;
export const TaskSchema = SchemaFactory.createForClass(Task);