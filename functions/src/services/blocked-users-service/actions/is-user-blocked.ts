import { db } from '../../../db';
import BlockedUserSchema from '../models/blocked-user';

const BLOCKED_TIME_HOURS = 24;

export async function isUserBlocked(rut: string) {
  const blockedUsers = await db
    .collection('blockedUsers')
    .where('rut', '==', rut)
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get();

  if (blockedUsers.empty) {
    return false;
  }

  const lastDocument = BlockedUserSchema.parse(blockedUsers.docs[0].data());

  const blockedUntilDate = lastDocument.createdAt;
  blockedUntilDate.setHours(blockedUntilDate.getHours() + BLOCKED_TIME_HOURS);

  return blockedUntilDate > new Date();
}
