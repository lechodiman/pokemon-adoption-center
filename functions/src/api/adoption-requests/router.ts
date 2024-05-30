import express = require('express');
import * as logger from 'firebase-functions/logger';
import { AdoptionRequestsService } from '../../services/adoption-requests-service';
import { PokemonService } from '../../services/pokemon-service';
import { z } from 'zod';
import { validateRut } from '@fdograph/rut-utilities';

const adoptionRequestsRouter = express.Router();

const adoptionRequestSchema = z.object({
  name: z.string(),
  lastname: z.string(),
  address: z.string(),
  rut: z.string().refine((value) => validateRut(value), {
    message: 'Invalid RUT',
  }),
  description: z.string(),
  pokemonID: z.string(),
});

adoptionRequestsRouter.post('/adoption-request', async (req, response) => {
  const { error, data } = adoptionRequestSchema.safeParse(req.body);

  if (error) {
    response.status(400).send(error.message);
    return;
  }

  try {
    const { name, lastname, address, rut, description, pokemonID } = data;

    const pokemon = await PokemonService.findPokemon(pokemonID as string);
    if (!pokemon) {
      response.status(404).send('Pokemon not found');
      return;
    }

    if (!pokemon.available) {
      response.status(409).send('Pokemon is not available');
      return;
    }

    if (!(await AdoptionRequestsService.canAdopt(rut))) {
      response.status(403).send('Adoption request rejected');
      return;
    }

    const adoptionId = await PokemonService.adoptPokemon(pokemonID, {
      name,
      lastname,
      address,
      rut,
      description,
    });

    response.status(201).json({ adpotionId: adoptionId });
  } catch (error) {
    logger.error('Error adopting Pokemon:', error);
    response.status(500).send('Error adopting Pokemon');
  }
});

adoptionRequestsRouter.get('/adoption-request/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const adoptionRequest = await AdoptionRequestsService.findAdoptionRequestById(id);

    if (!adoptionRequest) {
      res.status(404).send('Adoption request not found');
      return;
    }

    res.json(adoptionRequest);
  } catch (error) {
    logger.error('Error getting adoption request:', error);
    res.status(500).send('Error getting adoption request');
  }
});

export default adoptionRequestsRouter;
