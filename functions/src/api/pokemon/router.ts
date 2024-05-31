import { Router } from 'express';
import { list } from './controllers/list';

const pokemonRouter = Router();

pokemonRouter.get('/pokemon', list);

export default pokemonRouter;
