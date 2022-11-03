import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { testCheck } from '../shared/test.check';
import { AccessRights } from '../shared/access.right';
import {v4 as uuidV4} from 'uuid';

@Injectable()
export class DatabaseService implements OnModuleInit {

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private configService: ConfigService
  ) {  }

  getConnection(): Connection {
    return this.connection;
  }

  async onModuleInit() {
    await this.setAdmin();
  }

  async setAdmin(){
    if (!testCheck()) {
      const superAdmin = await this.connection.collection('users').findOne({ right: AccessRights.SUPERADMIN });
      
      if (!superAdmin){
        await this.connection.collection('users').insertOne({ 
          _id: uuidV4() as any,
          email: this.configService.get('DEFAULT_EMAIL'),
          phone: '0000000000',
          firstname: 'default',
          lastname: 'admin',
          right: AccessRights.SUPERADMIN,
          createdAt: new Date(), 
          updatedAt: new Date(),
          hidden: false
        });
      }
    }
  }
}
