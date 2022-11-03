import { ApiProperty } from "@nestjs/swagger";

export class AuthSchema {
  @ApiProperty({ description: 'Email of user', required: true })
  email: string;

  @ApiProperty({ description: 'One time password', required: true })
  password: string;
}