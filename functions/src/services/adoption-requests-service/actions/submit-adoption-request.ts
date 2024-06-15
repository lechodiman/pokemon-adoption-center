import { AdoptionRequestsRepository } from '../adoption-requests-repository';
import {
  ADOPTION_STATUS,
  AdoptionRequest,
  NewAdoptionRequest,
} from '../models/adoption-request';

export type AdoptionData = Pick<
  AdoptionRequest,
  'name' | 'lastname' | 'address' | 'rut' | 'description'
>;

export async function submitAdoptionRequest(
  pokemonId: string,
  adoptionData: AdoptionData
) {
  const newAdoptionData: NewAdoptionRequest = {
    ...adoptionData,
    status: ADOPTION_STATUS.PREPARATION,
    pokemonID: pokemonId,
  };

  const id = await AdoptionRequestsRepository.createSuccesfulAdoption(newAdoptionData);

  return id;
}
