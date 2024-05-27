import { db } from '../../../db';

export async function updateAdoptionRequest(id: string, data: any) {
  const adoptionRequestRef = db.collection('adoptionRequests').doc(id);
  await adoptionRequestRef.update(data);
}
