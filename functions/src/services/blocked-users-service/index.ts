import { blockUser } from './actions/block-user';
import { isUserBlocked } from './actions/is-user-blocked';

export const BlockedUsersService = {
  blockUser,
  isUserBlocked,
};
