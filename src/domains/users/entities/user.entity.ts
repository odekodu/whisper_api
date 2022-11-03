import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { AccessRights } from "../../../shared/access.right";
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true, versionKey: false })
export class User {

  @Prop({ type: String, default: function getId(){
    return uuidv4();
  }})
  _id?: string;

  @ApiProperty({ description: 'Email of user', required: true })
  @Prop({ unique: true, required: [true, "Email is required"] })
  email: string;

  @ApiProperty({ description: 'Phone number of user', required: true })
  @Prop({ unique: true, required: [true, "Phone is required"]})
  phone: string;

  @ApiProperty({ description: 'Firstname of user', required: true })
  @Prop({ required: [true, '"Firstname" is required']})
  firstname: string;

  @ApiProperty({ description: 'Lastname of user', required: true })
  @Prop({ required: [true, '"Lastname" is required']})
  lastname?: string;

  @ApiProperty({ description: 'Type of user' })
  @Prop({ type: String, default: AccessRights.CLIENT })
  right?: AccessRights;

  @ApiProperty({ description: 'Wallet address of user' })
  @Prop()
  wallet?: string;

  @ApiProperty({ description: 'Verification status of user' })
  @Prop({ default: false })
  verified?: boolean;

  @ApiProperty({ description: 'A deleted user' })
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