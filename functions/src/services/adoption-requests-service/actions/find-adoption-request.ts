import { AdoptionRequestsRepository } from '../adoption-requests-repository';

export async function findAdoptionRequestById(id: string) {
  return AdoptionRequestsRepository.findAdoptionRequestById(id);
}
