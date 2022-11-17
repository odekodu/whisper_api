import { ApiProperty, PickType } from "@nestjs/swagger";
import { ResponseSchema } from "../../../shared/response.schema";
import { Response } from "../entities/response.entity";

export class ListResponsesResponse extends PickType(ResponseSchema<Response[]>, ['payload', 'timestamp', 'success']){
  @ApiProperty({ description: 'The payload of the response', type: [Response] })
  payload?: Response[];
}