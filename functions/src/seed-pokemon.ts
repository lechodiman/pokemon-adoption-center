import axios from 'axios';
import { db } from './config/db';
import { faker } from '@faker-js/faker';
import { NewPokemon } from './services/pokemon-service/models/pokemon';

const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon/';

async function fetchPokemonData(id: number): Promise<any> {
  const response = await axios.get(`${POKEAPI_URL}${id}`);
  return response.data;
}

async function seedPokemon(pokemon: NewPokemon) {
  const pokemonRef = db.collection('pokemon').doc();
  await pokemonRef.set(pokemon);
}

async function main() {
  try {
    const pokemons: NewPokemon[] = [];
    for (let i = 1; i <= 25; i++) {
      const data = await fetchPokemonData(i);
      const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
      const types = data.types.map(
        (typeInfo: any) =>
          typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1)
      );

      const frontSprites = Object.entries(data.sprites)
        .filter(([key, value]) => key.includes('front') && value !== null)
        .map(([key, value]) => value as string);

      // Generate multiple instances with different nicknames
      for (let j = 0; j < 2; j++) {
        const pokemon: NewPokemon = {
          name: name,
          types,
          nickname: faker.person.firstName(),
          available: true,
          photoURL: frontSprites[Math.floor(Math.random() * frontSprites.length)],
        };
        pokemons.push(pokemon);
      }
    }

    for (const pokemon of pokemons) {
      await seedPokemon(pokemon);
    }

    console.log('Seeding completed.');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

main();
