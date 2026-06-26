import { User } from '@/shared/types/user';
import { UserModel } from '../models/user.model';

export interface UserRepository {
  findById(id: string): Promise<UserModel | null>;
  findAll(): Promise<UserModel[]>;
  create(user: Omit<User, 'id' | 'createdAt'>): Promise<UserModel>;
}

class MockUserRepository implements UserRepository {
  private users: User[] = [
    {
      id: '1',
      name: 'Rian Anggoro',
      email: 'rian@syntara.com',
      role: 'admin',
      createdAt: new Date('2026-01-15T08:00:00.000Z'),
    },
    {
      id: '2',
      name: 'Siti Rahma',
      email: 'siti@syntara.com',
      role: 'user',
      createdAt: new Date('2026-03-20T10:30:00.000Z'),
    },
    {
      id: '3',
      name: 'Budi Santoso',
      email: 'budi@syntara.com',
      role: 'user',
      createdAt: new Date('2026-05-12T14:45:00.000Z'),
    },
  ];

  async findById(id: string): Promise<UserModel | null> {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    return new UserModel(user);
  }

  async findAll(): Promise<UserModel[]> {
    return this.users.map((u) => new UserModel(u));
  }

  async create(user: Omit<User, 'id' | 'createdAt'>): Promise<UserModel> {
    const newUser: User = {
      ...user,
      id: String(this.users.length + 1),
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return new UserModel(newUser);
  }
}

export const userRepository: UserRepository = new MockUserRepository();
