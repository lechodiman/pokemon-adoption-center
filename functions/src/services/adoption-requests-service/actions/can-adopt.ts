import { db } from '../../../db';
import { BlockedUsersService } from '../../blocked-users-service';
import { ADOPTION_STATUS } from '../models/adoption-request';

export async function canAdopt(rut: string): Promise<boolean> {
  const lastAdoptionRequests = await getLastAdoptionRequests(rut);
  const allRejected = checkAllRejected(lastAdoptionRequests);

  if (allRejected) {
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

const SUCCESS_PROBABILITIES = {
  default: 0.5,
  withPreviousAdoptions: 0.9,
} as const;

async function getLastAdoptionRequests(rut: string) {
  return await db
    .collection('adoptionRequests')
    .where('rut', '==', rut)
    .orderBy('createdAt', 'desc')
    .limit(5)
    .get();
}

function checkAllRejected(
  adoptionRequests: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
): boolean {
  return adoptionRequests.docs.every(
    (doc) => doc.data().status === ADOPTION_STATUS.REJECTED
  );
}
