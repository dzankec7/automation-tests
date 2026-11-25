import { ApiClient } from './ApiClient';
import { User } from './schemas/user.schema';

export class UsersClient extends ApiClient {
  getUser(id: number) {
    return this.get<User>(`/users/${id}`);
  }
}
