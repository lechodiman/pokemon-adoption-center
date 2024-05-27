import { db } from '../../../db';

export async function findAdoptionRequestById(id: string) {
  const adoptionRequestRef = db.collection('adoptionRequests').doc(id);
  const adoptionRequest = await adoptionRequestRef.get();

  if (!adoptionRequest.exists) {
    return null;
  }

  return { id: adoptionRequest.id, ...adoptionRequest.data() };
}
