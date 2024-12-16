import { Test, TestingModule } from '@nestjs/testing';
import { DynamicTableController } from './dynamic-table.controller';

describe('DynamicTableController', () => {
  let controller: DynamicTableController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DynamicTableController],
    }).compile();

    controller = module.get<DynamicTableController>(DynamicTableController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
