import { adoptPokemon } from './actions/adopt-pokemon';
import { findAvailablePokemon } from './actions/find-available-pokemon';
import { findPokemon } from './actions/find-pokemon';
import { updatePokemon } from './actions/updatePokemon';

export const PokemonService = {
  findAvailablePokemon,
  findPokemon,
  adoptPokemon,
  updatePokemon,
};
