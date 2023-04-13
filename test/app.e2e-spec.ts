import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('App e2e tests', () => {
  beforeAll(async () => {
    const appModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it.todo('should pass, kk1');
});
