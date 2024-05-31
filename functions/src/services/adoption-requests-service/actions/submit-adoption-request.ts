import { db } from '../../../config/db';
import {
  ADOPTION_STATUS,
  AdoptionRequest,
  NewAdoptionRequest,
} from '../models/adoption-request';

export type AdoptionData = Pick<
  AdoptionRequest,
  'name' | 'lastname' | 'address' | 'rut' | 'description'
>;

export async function submitAdoptionRequest(
  pokemonId: string,
  adoptionData: AdoptionData
) {
  const pokemonRef = db.collection('pokemon').doc(pokemonId);
  const newAdoptionRef = db.collection('adoptionRequests').doc();

  const newAdoptionData: NewAdoptionRequest = {
    ...adoptionData,
    status: ADOPTION_STATUS.PREPARATION,
    pokemonID: pokemonId,
    createdAt: new Date().toISOString(),
  };

  await db.runTransaction(async (t) => {
    t.set(newAdoptionRef, newAdoptionData);
    t.update(pokemonRef, { available: false });
  });

  return newAdoptionRef.id;
}
