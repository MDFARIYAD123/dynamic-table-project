import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DynamicTableModule } from './dynamic-table/dynamic-table.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Fariyad123@', // Password should be a string
      database: 'DynamicTable',
      entities: [], // Add entity classes here
      synchronize: true, // For development; disable in production
    }),
    DynamicTableModule,
  ],
})
export class AppModule { }


