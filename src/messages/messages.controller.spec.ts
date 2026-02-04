import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

const mockService = () => ({
  findAll: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('MessagesController', () => {
  let controller: MessagesController;
  let service: ReturnType<typeof mockService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [{ provide: MessagesService, useFactory: mockService }],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
    service = module.get(MessagesService) as any;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('listMessages calls service.findAll', () => {
    service.findAll.mockReturnValue([]);
    expect(controller.listMessages()).toEqual([]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('updateMessage calls service.update', async () => {
    service.update.mockResolvedValue({ id: 1, content: 'b' });
    await expect(controller.updateMessage(1 as any, { content: 'b' })).resolves.toMatchObject({ content: 'b' });
    expect(service.update).toHaveBeenCalledWith(1, { content: 'b' });
  });

  it('deleteMessage calls service.remove', async () => {
    service.remove.mockResolvedValue({ deleted: true });
    await expect(controller.deleteMessage(1 as any)).resolves.toEqual({ deleted: true });
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
