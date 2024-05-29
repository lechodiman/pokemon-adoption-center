import { db } from '../../../db';
import { Pokemon } from '../models/pokemon';

type PartialPokemon = Partial<Omit<Pokemon, 'id' | 'name'>>;

export async function updatePokemon(id: string, data: PartialPokemon) {
  const pokemonRef = db.collection('pokemon').doc(id);
  await pokemonRef.update(data);
}
