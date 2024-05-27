import express = require('express');
import * as logger from 'firebase-functions/logger';
import { AdoptionRequestsService } from '../../services/adoption-requests-service';
import { PokemonService } from '../../services/pokemon-service';

const adoptionRequestsRouter = express.Router();

adoptionRequestsRouter.post('/adoption-request', async (req, response) => {
  const { name, lastname, address, rut, description, pokemonID } = req.body;

  try {
    const pokemon = await PokemonService.findPokemon(pokemonID as string);
    if (!pokemon) {
      response.status(404).send('Pokemon not found');
      return;
    }

    if (!pokemon.available) {
      response.status(409).send('Pokemon is not available');
      return;
    }

    const previousAdoptions =
      await AdoptionRequestsService.findPreviousSuccessfulAdoptions(rut);
    const hasPreviousSuccess = !previousAdoptions.empty;

    const successProbability = hasPreviousSuccess ? 0.9 : 0.5;
    const willAdopt = Math.random() < successProbability;

    if (!willAdopt) {
      response.status(403).send('Adoption request rejected');
      return;
    }

    const adoptionRefId = await PokemonService.adoptPokemon(pokemonID, {
      name,
      lastname,
      address,
      rut,
      description,
    });

    response.status(201).json({ adpotionId: adoptionRefId });
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
