import { Logger as NestLogger } from "@nestjs/common";

export class Logger {
  
  constructor(private context: string){}

  error(data: { reqId: string, error: Error }){
    NestLogger.error(`${data.reqId} *** ${data.error.message}`, this.context);
  }

  info(data: { reqId: string, message: string }){
    NestLogger.log(`${data.reqId} *** ${data.message}`, this.context);    
  }
}