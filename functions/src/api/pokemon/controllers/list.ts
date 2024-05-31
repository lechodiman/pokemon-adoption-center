import { Request, Response } from 'express';
import * as logger from 'firebase-functions/logger';
import { PokemonService } from '../../../services/pokemon-service';

export async function list(req: Request, res: Response) {
  try {
    const pokemon = await PokemonService.findAvailablePokemon();

    const responseFormat = req.headers.accept;
    if (responseFormat === 'text/html') {
      res.render('pokemon', { pokemon });
    } else {
      res.json({ data: pokemon });
    }
  } catch (error) {
    logger.error('Error getting available Pokemon:', error);
    res.status(500).send('Error getting available Pokemon');
  }
}
