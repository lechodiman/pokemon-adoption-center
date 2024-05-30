import { canAdopt } from './actions/can-adopt';
import { findAdoptionRequestById } from './actions/find-adoption-request';
import { processPokemonDelivery } from './actions/process-pokemon-delivery';
import { rejectAdoptionRequest } from './actions/reject-adoption-request';

export const AdoptionRequestsService = {
  findAdoptionRequestById,
  processPokemonDelivery,
  canAdopt,
  rejectAdoptionRequest,
};
