import { findAdoptionRequestById } from './actions/find-adoption-request';
import { findPreviousSuccessfulAdoptions } from './actions/find-previous-adoptions';
import { processPokemonDelivery } from './actions/process-pokemon-delivery';

export const AdoptionRequestsService = {
  findAdoptionRequestById,
  findPreviousSuccessfulAdoptions,
  processPokemonDelivery,
};
