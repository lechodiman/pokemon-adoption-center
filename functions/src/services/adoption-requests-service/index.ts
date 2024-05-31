import { adoptPokemon } from './actions/adopt-pokemon';
import { findAdoptionRequestById } from './actions/find-adoption-request';
import { processPokemonDelivery } from './actions/process-pokemon-delivery';

export const AdoptionRequestsService = {
  findAdoptionRequestById,
  processPokemonDelivery,
  adoptPokemon,
};
