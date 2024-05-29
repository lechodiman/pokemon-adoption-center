import { db } from '../../../db';
import { Pokemon, PokemonSchema } from '../models/pokemon';

export async function findPokemon(pokemonID: string): Promise<Pokemon | null> {
  const pokemonRef = db.collection('pokemon').doc(pokemonID);
  const pokemonSnapshot = await pokemonRef.get();
  if (!pokemonSnapshot.exists) {
    return null;
  }
  return PokemonSchema.parse({ id: pokemonSnapshot.id, ...pokemonSnapshot.data() });
}
