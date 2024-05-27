import { db } from '../../../db';

export async function findPreviousSuccessfulAdoptions(rut: string) {
  const previousAdoptions = await db
    .collection('adoptionRequests')
    .where('rut', '==', rut)
    .where('status', '==', 'success')
    .get();

  return previousAdoptions;
}
