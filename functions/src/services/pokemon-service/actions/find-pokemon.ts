import { db } from '../../../db';

export async function findPokemon(pokemonID: string) {
  const pokemonRef = db.collection('pokemon').doc(pokemonID);
  const pokemonSnapshot = await pokemonRef.get();
  if (!pokemonSnapshot.exists) {
    return null;
  }
  return pokemonSnapshot.data();
}
