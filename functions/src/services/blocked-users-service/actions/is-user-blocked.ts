import { BlockedUsersRepository } from '../blocked-users-repository';

const BLOCKED_TIME_HOURS = 24;

export async function isUserBlocked(rut: string) {
  const blockedUser = await BlockedUsersRepository.findLastBlockedUserByRut(rut);

  if (!blockedUser) {
    return false;
  }

  const blockedUntilDate = blockedUser.createdAt;
  blockedUntilDate.setHours(blockedUntilDate.getHours() + BLOCKED_TIME_HOURS);

  return blockedUntilDate > new Date();
}
