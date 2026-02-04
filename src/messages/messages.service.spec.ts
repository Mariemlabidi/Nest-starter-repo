import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { Message } from './message.entity';

describe('MessagesService (simplified)', () => {
  let service: MessagesService;
  let repo: any;

  const repoMock = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: getRepositoryToken(Message), useValue: repoMock },
      ],
    }).compile();

    service = module.get(MessagesService);
    repo = module.get(getRepositoryToken(Message));
    jest.clearAllMocks();
  });

  it('create / findOne (not found -> found)', async () => {
    const dto = { content: 'x' };
    const created = { id: 1, ...dto };
    repo.create.mockReturnValue(created);
    repo.save.mockResolvedValue(created);

    await expect(service.create(dto as any)).resolves.toEqual(created);
    expect(repo.create).toHaveBeenCalledWith(dto);

    repo.findOneBy.mockResolvedValueOnce(undefined);
    await expect(service.findOne(1)).rejects.toThrow();

    const found = { id: 1, content: 'a' };
    repo.findOneBy.mockResolvedValueOnce(found);
    await expect(service.findOne(1)).resolves.toEqual(found);
  });

  it('update and remove', async () => {
    const found = { id: 1, content: 'a' };
    repo.findOneBy.mockResolvedValue(found);

    repo.save.mockResolvedValue({ ...found, content: 'b' });
    await expect(service.update(1, { content: 'b' } as any)).resolves.toMatchObject({ content: 'b' });

    repo.remove.mockResolvedValue(undefined);
    await expect(service.remove(1)).resolves.toEqual({ deleted: true });
  });
});
