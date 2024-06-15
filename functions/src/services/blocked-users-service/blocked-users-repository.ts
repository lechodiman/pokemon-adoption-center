import { db } from '../../config/db';
import BlockedUserSchema, { NewBlockedUser } from './models/blocked-user';

const COLLECTION_NAME = 'blockedUsers';

export const BlockedUsersRepository = {
  async create(blockedUser: NewBlockedUser) {
    await db.collection(COLLECTION_NAME).add(blockedUser);
  },

  async findLastBlockedUserByRut(rut: string) {
    const blockedUsers = await db
      .collection(COLLECTION_NAME)
      .orderBy('createdAt', 'desc')
      .where('rut', '==', rut)
      .limit(1)
      .get();

    return blockedUsers.empty
      ? null
      : BlockedUserSchema.parse({
          id: blockedUsers.docs[0].id,
          ...blockedUsers.docs[0].data(),
        });
  },
};
