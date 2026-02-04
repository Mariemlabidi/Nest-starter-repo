import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { MessagesModule } from '../src/messages/messages.module';

describe('Messages (e2e)', () => {
  let app: INestApplication;
  let ds: DataSource;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_DB = 'messages_test';
    process.env.DATABASE_USER = 'test';
    process.env.DATABASE_PASSWORD = 'test';
    process.env.DATABASE_PORT = String(process.env.DATABASE_PORT || 5433);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MessagesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    ds = moduleFixture.get<DataSource>(DataSource);
    await ds.synchronize(true);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/messages (POST) -> /messages/:id (GET) -> PATCH -> DELETE (full flow)', async () => {
    const createRes = await request(app.getHttpServer()).post('/messages').send({ content: 'hello' }).expect(201);
    expect(createRes.body).toEqual(expect.objectContaining({ id: expect.any(Number), content: 'hello' }));

    const id = createRes.body.id;
    await request(app.getHttpServer()).get(`/messages/${id}`).expect(200).then(r => expect(r.body.content).toBe('hello'));

    await request(app.getHttpServer()).patch(`/messages/${id}`).send({ content: 'world' }).expect(200).then(r => expect(r.body.content).toBe('world'));

    await request(app.getHttpServer()).delete(`/messages/${id}`).expect(200).then(r => expect(r.body.deleted).toBe(true));

    await request(app.getHttpServer()).get(`/messages/${id}`).expect(404);
  }, 20000);
});