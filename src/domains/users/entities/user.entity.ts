import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { AccessRights } from "../../../shared/access.right";
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true, versionKey: false })
export class User {

  @ApiProperty({ description: 'The user id' })
  @Prop({ type: String, default: uuidv4 })
  _id?: string;

  @ApiProperty({ description: 'The user email' })
  @Prop({ unique: true, required: [true, "Email is required"] })
  email: string;

  @ApiProperty({ description: 'The user phone' })
  @Prop({ unique: true, required: [true, "Phone is required"]})
  phone: string;

  @ApiProperty({ description: 'The user firstname' })
  @Prop({ required: [true, '"Firstname" is required']})
  firstname: string;

  @ApiProperty({ description: 'The user lastname' })
  @Prop({ required: [true, '"Lastname" is required']})
  lastname?: string;

  @ApiProperty({ description: 'The user access level' })
  @Prop({ type: String, default: AccessRights.CLIENT })
  right?: AccessRights;

  @ApiProperty({ description: 'The user verification status' })
  @Prop({ default: false })
  verified?: boolean;

  @ApiProperty({ description: 'The user deletion flag' })
  @Prop({ default: false })
  hidden?: boolean;

  @ApiProperty({ description: 'The user creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'The user update date' })
  updatedAt: Date;

  static toResponse(data: any){
    const user = data._doc;
    delete user.hidden;
    
    return user;
  }
}

export type UserDocument = User | Document;
export const UserSchema = SchemaFactory.createForClass(User);