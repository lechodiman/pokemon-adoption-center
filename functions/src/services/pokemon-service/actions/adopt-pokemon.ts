import { db } from '../../../db';
import { AdoptionRequest } from '../../adoption-requests-service/models/adoption-request';

export type AdoptionData = Pick<
  AdoptionRequest,
  'name' | 'lastname' | 'address' | 'rut' | 'description'
>;

export async function adoptPokemon(pokemonId: string, adoptionData: AdoptionData) {
  const pokemonRef = db.collection('pokemon').doc(pokemonId);
  const newAdoptionRef = db.collection('adoptionRequests').doc();

  await db.runTransaction(async (t) => {
    t.set(newAdoptionRef, {
      ...adoptionData,
      pokemonID: pokemonId,
      status: 'preparation',
    });
    t.update(pokemonRef, { available: false });
  });

  return newAdoptionRef.id;
}
