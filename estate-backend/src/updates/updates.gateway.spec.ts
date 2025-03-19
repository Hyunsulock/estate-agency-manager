import { Test, TestingModule } from '@nestjs/testing';
import { UpdatesGateway } from './updates.gateway';
import { UpdatesService } from './updates.service';

describe('UpdatesGateway', () => {
  let gateway: UpdatesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpdatesGateway, UpdatesService],
    }).compile();

    gateway = module.get<UpdatesGateway>(UpdatesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
