import { v4 as uuid } from 'uuid';

export function setRequestId(req, _, next){
  req.reqId = uuid();
  
  next();
}