import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class CreateResponseDto {
    @ApiProperty({ description: 'The task id' })
    task: string;

    @ApiProperty({ description: 'The status of the response' })
    status: HttpStatus;

    @ApiProperty({ description: 'The error response' })
    error: string;

    @ApiProperty({ description: 'The content of the response body' })
    body: any;
}
