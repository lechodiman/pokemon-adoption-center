import { AdoptionRequestsRepository } from '../adoption-requests-repository';
import { AdoptionRequest } from '../models/adoption-request';

type Params = Omit<AdoptionRequest, 'status' | 'id' | 'createdAt'>;

export async function rejectAdoptionRequest({
  pokemonID,
  name,
  lastname,
  address,
  rut,
  description,
}: Params) {
  const newAdoptionId = await AdoptionRequestsRepository.create({
    pokemonID,
    name,
    lastname,
    address,
    rut,
    description,
    status: 'rejected',
  });

  return newAdoptionId;
}
