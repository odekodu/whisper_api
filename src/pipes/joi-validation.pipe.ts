import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Schema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {

  constructor(private schema: Schema){}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    
    if(error){
      throw new BadRequestException(error);
    }
    
    return value;
  }
}
