import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { v4 as uuidv4 } from 'uuid';
import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

@Schema({ timestamps: true, versionKey: false })
export class Response {

  @ApiProperty({ description: 'The response id' })
  @Prop({ type: String, default: uuidv4 })
  _id?: string;

  @ApiProperty({ description: 'The response task id' })
  @Prop({ type: String, required: [true, "Task is required"] })
  task: string;

  @ApiProperty({ description: 'The response status' })
  @Prop({ type: Number, required: [true, "Status is required"] })
  status: HttpStatus;

  @ApiProperty({ description: 'The response error' })
  @Prop({ type: {} })
  error?: any;

  @ApiProperty({ description: 'The response body' })
  @Prop({ type: {} })
  body?: any;

  @ApiProperty({ description: 'The response creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'The response update date' })
  updatedAt: Date;

  static toResponse(data: any){
    const response = data._doc;    
    return response;
  }
}

export type ResponseDocument = Response | Document;
export const ResponseSchema = SchemaFactory.createForClass(Response);