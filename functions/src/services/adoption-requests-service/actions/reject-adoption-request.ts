import { db } from '../../../db';
import {
  ADOPTION_STATUS,
  AdoptionRequest,
  NewAdoptionRequest,
} from '../models/adoption-request';

type Params = Omit<AdoptionRequest, 'status' | 'id'>;

export async function rejectAdoptionRequest({
  pokemonID,
  name,
  lastname,
  address,
  rut,
  description,
}: Params) {
  const newAdoptionRef = db.collection('adoptionRequests').doc();

  const newAdoptionRequestDocument: NewAdoptionRequest = {
    pokemonID,
    name,
    lastname,
    address,
    rut,
    description,
    status: ADOPTION_STATUS.REJECTED,
    createdAt: new Date().toISOString(),
  };

  await newAdoptionRef.set(newAdoptionRequestDocument);

  return newAdoptionRef.id;
}
