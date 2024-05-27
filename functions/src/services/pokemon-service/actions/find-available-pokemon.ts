import { db } from '../../../db';

export async function findAvailablePokemon() {
  const snapshot = await db.collection('pokemon').where('available', '==', true).get();
  const pokemon: FirebaseFirestore.DocumentData[] = [];
  snapshot.forEach((doc) => {
    pokemon.push({ id: doc.id, ...doc.data() });
  });

  return pokemon;
}
