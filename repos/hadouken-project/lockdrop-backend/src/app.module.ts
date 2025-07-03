import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config';
import {
  GraphQLModuleGodwoken,
  GraphQLModuleMantle,
  GraphQLModuleZkSync,
} from './modules/graphql';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    GraphQLModuleGodwoken.forRoot(GraphQLModuleGodwoken, null),
    GraphQLModuleMantle.forRoot(GraphQLModuleMantle, null),
    GraphQLModuleZkSync.forRoot(GraphQLModuleZkSync, null),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {}
}
