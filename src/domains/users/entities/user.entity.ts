import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { AccessRights } from "../../../shared/access.right";
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true, versionKey: false })
export class User {

  @Prop({ type: String, default: uuidv4 })
  _id?: string;

  @Prop({ unique: true, required: [true, "Email is required"] })
  email: string;

  @Prop({ unique: true, required: [true, "Phone is required"]})
  phone: string;

  @Prop({ required: [true, '"Firstname" is required']})
  firstname: string;

  @Prop({ required: [true, '"Lastname" is required']})
  lastname?: string;

  @Prop({ type: String, default: AccessRights.CLIENT })
  right?: AccessRights;

  @Prop({ default: false })
  verified?: boolean;

  @Prop({ default: false })
  hidden?: boolean;

  createdAt: Date;

  updatedAt: Date;

  static toResponse(data: any){
    const user = data._doc;
    delete user.hidden;
    
    return user;
  }
}

export type UserDocument = User | Document;
export const UserSchema = SchemaFactory.createForClass(User);