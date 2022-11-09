import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from 'uuid';
import { TaskMethodEnum } from "../../../shared/task_method.enum";
import { Auth } from "../../../shared/auth.interface";
import { CronExpression } from "@nestjs/schedule";

@Schema({ timestamps: true, versionKey: false })
export class Task {

  @Prop({ type: String, default: uuidv4 })
  _id?: string;

  @Prop({ type: String, required: [true, "Owner is required"] })
  owner: string;

  @Prop({ type: String, required: [true, "Title is required"] })
  title: string;

  @Prop({ required: [true, "URI is required"] })
  uri: string;

  @Prop({ required: [true, "Method is required"] })
  method: TaskMethodEnum;

  @Prop({ type: String, required: [true, "When is required"] })
  when: CronExpression;

  @Prop({ default: false })
  active: boolean;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: {} })
  body?: any;

  @Prop({ type: {} })
  auth?: Auth;

  createdAt: Date;

  updatedAt: Date;

  static toResponse(data: any){
    const task = data._doc;    
    return task;
  }
}

export type TaskDocument = Task | Document;
export const TaskSchema = SchemaFactory.createForClass(Task);