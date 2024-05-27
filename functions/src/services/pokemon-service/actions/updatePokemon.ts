import { db } from '../../../db';

export async function updatePokemon(id: string, data: any) {
  const pokemonRef = db.collection('pokemon').doc(id);
  await pokemonRef.update(data);
}
