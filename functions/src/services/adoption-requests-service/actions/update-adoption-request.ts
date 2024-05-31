import { db } from '../../../config/db';
import { AdoptionRequest } from '../models/adoption-request';

export async function updateAdoptionRequest(
  id: string,
  data: { status: AdoptionRequest['status'] }
) {
  const adoptionRequestRef = db.collection('adoptionRequests').doc(id);
  await adoptionRequestRef.update(data);
}
