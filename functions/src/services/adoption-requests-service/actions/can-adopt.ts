import { db } from '../../../config/db';
import AdoptionRequestSchema, { ADOPTION_STATUS } from '../models/adoption-request';

const SUCCESS_PROBABILITIES = {
  default: 0.5,
  withPreviousAdoptions: 0.9,
} as const;

export async function determineAdoptionEligibility(rut: string): Promise<boolean> {
  const previousAdoptions = await findPreviousSuccessfulAdoptions(rut);
  const hasPreviousSuccess = !previousAdoptions.empty;

  const successProbability = hasPreviousSuccess
    ? SUCCESS_PROBABILITIES.withPreviousAdoptions
    : SUCCESS_PROBABILITIES.default;
  const willAdopt = Math.random() < successProbability;

  return willAdopt;
}

export async function areLastAdoptionsRejected(rut: string) {
  const NUM_OF_REQS = 5;

  const adoptionRequests = await db
    .collection('adoptionRequests')
    .where('rut', '==', rut)
    .orderBy('createdAt', 'desc')
    .limit(NUM_OF_REQS)
    .get();

  if (adoptionRequests.empty) {
    return false;
  }

  const mostRecentAdoptionDoc = adoptionRequests.docs[0];
  const mostRecentAdoptionRequest = AdoptionRequestSchema.parse({
    id: mostRecentAdoptionDoc.id,
    ...mostRecentAdoptionDoc.data(),
  });

  const createdAt = mostRecentAdoptionRequest.createdAt;
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const isLastAttemptRecent = oneDayAgo < createdAt;

  return (
    adoptionRequests.docs.length === NUM_OF_REQS &&
    adoptionRequests.docs.every(
      (doc) => doc.data().status === ADOPTION_STATUS.REJECTED
    ) &&
    isLastAttemptRecent
  );
}

async function findPreviousSuccessfulAdoptions(rut: string) {
  const previousAdoptions = await db
    .collection('adoptionRequests')
    .where('rut', '==', rut)
    .where('status', '==', ADOPTION_STATUS.SUCCESS)
    .get();

  return previousAdoptions;
}
