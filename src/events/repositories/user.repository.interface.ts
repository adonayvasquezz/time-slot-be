import { User } from '../entities/user.entity';

export interface IUserRepository {
  create(userData: Partial<User>): Promise<User>;
  findByExternalId(externalId: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, userData: Partial<User>): Promise<User>;
  delete(id: string): Promise<User>;
}
