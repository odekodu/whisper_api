import { ApiProperty, PickType } from "@nestjs/swagger";
import { ResponseSchema } from "../../../shared/response.schema";
import { Task } from "../entities/task.entity";

export class ListTasksResponse extends PickType(ResponseSchema<Task[]>, ['payload', 'timestamp', 'success']){
  @ApiProperty({ description: 'The payload of the response', type: [Task] })
  payload?: Task[];
}