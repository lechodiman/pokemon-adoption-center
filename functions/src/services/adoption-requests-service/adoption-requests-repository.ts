import { db } from '../../config/db';
import AdoptionRequestSchema, { NewAdoptionRequest } from './models/adoption-request';

const COLLECTION_NAME = 'adoptionRequests';

export const AdoptionRequestsRepository = {
  async findAdoptionRequestById(id: string) {
    const adoptionRequestRef = db.collection(COLLECTION_NAME).doc(id);
    const adoptionRequest = await adoptionRequestRef.get();

    if (!adoptionRequest.exists) {
      return null;
    }

    return AdoptionRequestSchema.parse({
      id: adoptionRequest.id,
      ...adoptionRequest.data(),
    });
  },

  async create(params: NewAdoptionRequest) {
    const newAdoptionRef = db.collection(COLLECTION_NAME).doc();

    const newAdoptionRequestDocument = {
      ...params,
      createdAt: new Date().toISOString(),
    };

    await newAdoptionRef.set(newAdoptionRequestDocument);

    return newAdoptionRef.id;
  },

  async createSuccesfulAdoption(params: NewAdoptionRequest) {
    const newAdoptionRef = db.collection(COLLECTION_NAME).doc();

    const newAdoptionRequestDocument = {
      ...params,
      createdAt: new Date().toISOString(),
    };

    await db.runTransaction(async (t) => {
      const pokemonRef = db.collection('pokemon').doc(params.pokemonID);
      const pokemonSnapshot = await t.get(pokemonRef);
      const pokemon = pokemonSnapshot.data();

      if (!pokemon || !pokemon.available) {
        throw new Error('Pokemon is not available');
      }

      t.update(pokemonRef, { available: false });

      t.set(newAdoptionRef, newAdoptionRequestDocument);
    });

    return newAdoptionRef.id;
  },
};
