import { db } from '../../../db';

export interface AdoptionData {
  name: string;
  lastname: string;
  address: string;
  rut: string;
  description: string;
}

export async function adoptPokemon(pokemonId: string, adoptionData: AdoptionData) {
  const pokemonRef = db.collection('pokemon').doc(pokemonId);
  const newAdoptionRef = db.collection('adoptionRequests').doc();

  await db.runTransaction(async (t) => {
    t.set(newAdoptionRef, {
      ...adoptionData,
      status: 'preparation',
    });
    t.update(pokemonRef, { available: false });
  });

  return newAdoptionRef.id;
}
