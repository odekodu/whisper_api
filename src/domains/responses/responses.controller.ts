import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { CreateResponseDto } from './dto/create-response.dto';
import { UpdateResponseDto } from './dto/update-response.dto';

@Controller('responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Post()
  create(@Body() createResponseDto: CreateResponseDto) {
    return this.responsesService.create(createResponseDto);
  }

  @Get()
  findAll() {
    return this.responsesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.responsesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResponseDto: UpdateResponseDto) {
    return this.responsesService.update(+id, updateResponseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.responsesService.remove(+id);
  }
}
