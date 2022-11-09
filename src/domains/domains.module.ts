import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { TasksModule } from './tasks/tasks.module';
import { ResponsesModule } from './responses/responses.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProfileModule,
    TasksModule,
    ResponsesModule
  ]
})
export class DomainsModule {}
