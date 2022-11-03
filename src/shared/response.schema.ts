import { ApiProperty } from "@nestjs/swagger";

export class ResponseSchema <T = any>{
  @ApiProperty({ description: 'Status of the response'})
  success: boolean;

  @ApiProperty({ description: 'The payload of the response' })
  payload?: T;

  @ApiProperty({ description: 'The message of the response'})
  message?: string;

  @ApiProperty({ description: 'The timestamp of the response'})
  timestamp?: string;
}