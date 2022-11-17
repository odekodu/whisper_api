import { HttpStatus } from "@nestjs/common";
import { CreateResponseDto } from "../../src/domains/responses/dto/create-response.dto";
import { Response } from "../../src/domains/responses/entities/response.entity";

export const createResponseStub = (task: string): CreateResponseDto => ({
  task,
  status: HttpStatus.OK,
  error: '',
  body: { success: true }
});

export const responseStub = (task: string): Partial<Response> => ({
  task,
  status: HttpStatus.OK,
  error: '',
  body: { success: true }
});

