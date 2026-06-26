import { userRepository, UserRepository } from '../repositories/user.repository';
import { UserModel } from '../models/user.model';

export class GetUsersUseCase {
  constructor(private userRepo: UserRepository = userRepository) {}

  async execute(): Promise<UserModel[]> {
    // You can add logic here: logging, authorization check, filtering, caching, etc.
    return await this.userRepo.findAll();
  }
}
