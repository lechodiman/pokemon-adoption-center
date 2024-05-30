import { db } from '../../../db';
import { BlockedUsersService } from '../../blocked-users-service';
import { ADOPTION_STATUS } from '../models/adoption-request';
import * as logger from 'firebase-functions/logger';

const SUCCESS_PROBABILITIES = {
  default: 0,
  withPreviousAdoptions: 0.9,
} as const;

export async function canAdopt(rut: string): Promise<boolean> {
  const allRejected = await areLastAdoptionsRejected(rut);

  if (allRejected) {
    logger.error('User has 5 consecutive rejections:', rut);
    await BlockedUsersService.blockUser(rut);
    return false;
  }

  const previousAdoptions = await findPreviousSuccessfulAdoptions(rut);
  const hasPreviousSuccess = !previousAdoptions.empty;

  const successProbability = hasPreviousSuccess
    ? SUCCESS_PROBABILITIES.withPreviousAdoptions
    : SUCCESS_PROBABILITIES.default;
  const willAdopt = Math.random() < successProbability;

  return willAdopt;
}

async function findPreviousSuccessfulAdoptions(rut: string) {
  const previousAdoptions = await db
    .collection('adoptionRequests')
    .where('rut', '==', rut)
    .where('status', '==', ADOPTION_STATUS.SUCCESS)
    .get();

  return previousAdoptions;
}

async function areLastAdoptionsRejected(rut: string) {
  const NUM_OF_REQS = 5;

  const adoptionRequests = await db
    .collection('adoptionRequests')
    .where('rut', '==', rut)
    .orderBy('createdAt', 'desc')
    .limit(NUM_OF_REQS)
    .get();

  return (
    adoptionRequests.docs.length === NUM_OF_REQS &&
    adoptionRequests.docs.every((doc) => doc.data().status === ADOPTION_STATUS.REJECTED)
  );
}
