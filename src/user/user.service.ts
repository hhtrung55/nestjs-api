import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async me() {
    return 'get me';
  }
}
