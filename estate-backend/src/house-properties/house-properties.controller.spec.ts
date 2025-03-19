import { Test, TestingModule } from '@nestjs/testing';
import { HousePropertiesController } from './house-properties.controller';
import { HousePropertiesService } from './house-properties.service';

describe('HousePropertiesController', () => {
  let controller: HousePropertiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HousePropertiesController],
      providers: [HousePropertiesService],
    }).compile();

    controller = module.get<HousePropertiesController>(HousePropertiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
