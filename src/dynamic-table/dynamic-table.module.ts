import { Module } from '@nestjs/common';
import { DynamicTableService } from './dynamic-table.service';
import { DynamicTableController } from './dynamic-table.controller';

@Module({
  providers: [DynamicTableService],
  controllers: [DynamicTableController]
})
export class DynamicTableModule {}
