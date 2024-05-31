import { z } from 'zod';

export const PokemonSchema = z.object({
  id: z.string(),
  name: z.string(),
  available: z.boolean(),
  photoURL: z.string(),
  types: z.array(z.string()),
  nickname: z.string().optional(),
});

export type Pokemon = z.infer<typeof PokemonSchema>;

export type NewPokemon = Omit<Pokemon, 'id'>;
