import { db } from '../../config/db';
import { Pokemon, PokemonSchema } from './models/pokemon';

const COLLECTION_NAME = 'pokemon';

export const PokemonRepository = {
  async findAvailablePokemon() {
    const snapshot = await db.collection('pokemon').where('available', '==', true).get();
    const pokemon = snapshot.docs.map((doc) =>
      PokemonSchema.parse({ id: doc.id, ...doc.data() })
    );
    return pokemon;
  },

  async findPokemonById(id: string) {
    const pokemonRef = db.collection(COLLECTION_NAME).doc(id);
    const pokemonSnapshot = await pokemonRef.get();
    if (!pokemonSnapshot.exists) {
      return null;
    }
    return PokemonSchema.parse({ id: pokemonSnapshot.id, ...pokemonSnapshot.data() });
  },

  async updatePokemon(id: string, data: Partial<Omit<Pokemon, 'id' | 'name'>>) {
    const pokemonRef = db.collection(COLLECTION_NAME).doc(id);
    await pokemonRef.update(data);
  },
};
