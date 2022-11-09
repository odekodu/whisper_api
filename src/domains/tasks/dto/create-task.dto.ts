import { CronExpression } from "@nestjs/schedule";
import { ApiProperty } from "@nestjs/swagger";
import { Auth } from "../../../shared/auth.interface";
import { TaskMethodEnum } from "../../../shared/task_method.enum";

export class CreateTaskDto {  
    @ApiProperty({ description: 'Title of task' })
    title: string;

    @ApiProperty({ description: 'URI of task', required: true })
    uri: string;

    @ApiProperty({ description: 'HTTP Method of task', required: true })
    method: TaskMethodEnum;

    @ApiProperty({ description: 'When to run task', required: true })
    when: CronExpression;

    @ApiProperty({ description: 'Task status', default: false, required: true })
    active: boolean;
    
    @ApiProperty({ description: 'Description of task' })
    description?: string;

    @ApiProperty({ description: 'Request body of task' })
    body?: any;

    @ApiProperty({ description: 'URL authentication' })
    auth?: Auth;
}
