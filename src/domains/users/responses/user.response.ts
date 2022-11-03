import { ApiProperty, PickType } from "@nestjs/swagger";
import { ResponseSchema } from "../../../shared/response.schema";
import { User } from "../entities/user.entity";

export class UserResponse extends PickType(ResponseSchema<User>, ['payload', 'timestamp', 'success']){
  @ApiProperty({ description: 'The payload of the response', type: User })
  payload?: User;
}