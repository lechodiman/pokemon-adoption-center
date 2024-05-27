import express = require('express');
import { PokemonService } from '../../services/pokemon-service';
import * as logger from 'firebase-functions/logger';

const pokemonRouter = express.Router();

pokemonRouter.get('/pokemon', async (req, res) => {
  try {
    const pokemon = await PokemonService.findAvailablePokemon();
    const responseFormat = req.headers.accept;
    if (responseFormat === 'text/html') {
      res.render('pokemon', { pokemon });
    } else {
      res.json(pokemon);
    }
  } catch (error) {
    logger.error('Error getting available Pokemon:', error);
    res.status(500).send('Error getting available Pokemon');
  }
});

export default pokemonRouter;
