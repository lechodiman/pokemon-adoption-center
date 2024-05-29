import { db } from '../../../db';
import { PokemonSchema } from '../models/pokemon';

export async function findAvailablePokemon() {
  const snapshot = await db.collection('pokemon').where('available', '==', true).get();
  const pokemon = snapshot.docs.map((doc) =>
    PokemonSchema.parse({ id: doc.id, ...doc.data() })
  );
  return pokemon;
}
