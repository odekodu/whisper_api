import { ApiProperty } from "@nestjs/swagger";
import { AccessRights } from "../../../shared/access.right";

export class CreateUserDto {
  @ApiProperty({ description: 'Email of user', required: true })
  email: string;

  @ApiProperty({ description: 'Firstname of user', required: true })
  firstname: string;

  @ApiProperty({ description: 'Lastname of user', required: true })
  lastname: string;

  @ApiProperty({ description: 'Phone number of user', required: true })
  phone: string;

  @ApiProperty({ description: 'User access level' })
  right: AccessRights
}
