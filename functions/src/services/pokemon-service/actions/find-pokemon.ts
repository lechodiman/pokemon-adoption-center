import { Pokemon } from '../models/pokemon';
import { PokemonRepository } from '../pokemon-repository';

export async function findPokemon(pokemonID: string): Promise<Pokemon | null> {
  return PokemonRepository.findPokemonById(pokemonID);
}
