import { BlockedUsersRepository } from '../blocked-users-repository';
import { NewBlockedUser } from '../models/blocked-user';

export async function blockUser(rut: string) {
  const blockedUser: NewBlockedUser = {
    rut,
    createdAt: new Date().toISOString(),
  };

  await BlockedUsersRepository.create(blockedUser);
}
