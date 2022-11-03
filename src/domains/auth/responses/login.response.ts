import { ApiProperty, PickType } from "@nestjs/swagger";
import { ResponseSchema } from "../../../shared/response.schema";

export class LoginResponse extends PickType(ResponseSchema, ['timestamp', 'success', 'payload']){
  @ApiProperty({ description: 'The login token', type: String })
  payload?: string;
}