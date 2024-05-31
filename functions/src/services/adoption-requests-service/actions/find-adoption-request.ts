import { db } from '../../../config/db';
import AdoptionRequestSchema from '../models/adoption-request';

export async function findAdoptionRequestById(id: string) {
  const adoptionRequestRef = db.collection('adoptionRequests').doc(id);
  const adoptionRequest = await adoptionRequestRef.get();

  if (!adoptionRequest.exists) {
    return null;
  }

  return AdoptionRequestSchema.parse({
    id: adoptionRequest.id,
    ...adoptionRequest.data(),
  });
}
