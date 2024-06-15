import { PokemonRepository } from '../pokemon-repository';

export async function findAvailablePokemon() {
  return PokemonRepository.findAvailablePokemon();
}
