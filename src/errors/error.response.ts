import { PickType } from "@nestjs/swagger";
import { ResponseSchema } from "../shared/response.schema";

export class ErrorResponse extends PickType(ResponseSchema, ['message', 'timestamp', 'success']) {
}