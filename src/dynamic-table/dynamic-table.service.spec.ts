import { Test, TestingModule } from '@nestjs/testing';
import { DynamicTableService } from './dynamic-table.service';

describe('DynamicTableService', () => {
  let service: DynamicTableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamicTableService],
    }).compile();

    service = module.get<DynamicTableService>(DynamicTableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
