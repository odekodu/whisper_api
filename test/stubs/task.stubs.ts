import { CronExpression } from "@nestjs/schedule";
import { CreateTaskDto } from "../../src/domains/tasks/dto/create-task.dto";
import { Task } from "../../src/domains/tasks/entities/task.entity";
import { TaskMethodEnum } from "../../src/shared/task_method.enum";

export const createTaskStub: CreateTaskDto = {
  title: 'Sample',
  uri: 'https://google.com',
  method: TaskMethodEnum.GET,
  when: CronExpression.EVERY_SECOND,
  active: false
}

export const taskStub: Partial<Task> = {
  ...createTaskStub
}

