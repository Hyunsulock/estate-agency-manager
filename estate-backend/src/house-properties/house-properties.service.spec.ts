import { Test, TestingModule } from '@nestjs/testing';
import { HousePropertiesService } from './house-properties.service';

describe('HousePropertiesService', () => {
  let service: HousePropertiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HousePropertiesService],
    }).compile();

    service = module.get<HousePropertiesService>(HousePropertiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
