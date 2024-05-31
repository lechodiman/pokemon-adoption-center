import { validateRut } from '@fdograph/rut-utilities';
import { Request, Response } from 'express';
import * as logger from 'firebase-functions/logger';
import { z } from 'zod';
import { PokemonService } from '../../../services/pokemon-service';
import { AdoptionRequestsService } from '../../../services/adoption-requests-service';

const PostAdoptionRequestSchema = z.object({
  name: z.string(),
  lastname: z.string(),
  address: z.string(),
  rut: z.string().refine((value) => validateRut(value), {
    message: 'Invalid RUT',
  }),
  description: z.string(),
  pokemonID: z.string(),
});

export async function handleAdoptionRequest(req: Request, response: Response) {
  const { error, data } = PostAdoptionRequestSchema.safeParse(req.body);

  if (error) {
    response.status(400).json({ error: error.errors });
    return;
  }

  try {
    const pokemon = await PokemonService.findPokemon(data.pokemonID);

    if (!pokemon || !pokemon.available) {
      response.status(404).send('Pokemon not found');
      return;
    }

    const adoptionId = await AdoptionRequestsService.adoptPokemon(data);

    if (!adoptionId) {
      response.status(403).send('Adoption request rejected');
      return;
    }

    response.status(201).json({ adpotionId: adoptionId });
  } catch (error) {
    logger.error('Error adopting Pokemon:', error);
    response.status(500).send('Error adopting Pokemon');
  }
}
