import { db } from '../../../config/db';
import { NewBlockedUser } from '../models/blocked-user';

export async function blockUser(rut: string) {
  const blockedUser: NewBlockedUser = {
    rut,
    createdAt: new Date().toISOString(),
  };

  await db.collection('blockedUsers').add(blockedUser);
}
