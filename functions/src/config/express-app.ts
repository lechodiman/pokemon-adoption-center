import * as cors from 'cors';
import * as express from 'express';
import rateLimit from 'express-rate-limit';
import * as path from 'path';
import pokemonRouter from '../api/pokemon/router';
import adoptionRequestsRouter from '../api/adoption-requests/router';

export function createExpressApp() {
  const app = express();

  app.set('trust proxy', 1);

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '..', '..', 'views'));

  app.use(cors({ origin: true }));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  });

  app.use(limiter);

  app.use(pokemonRouter);
  app.use(adoptionRequestsRouter);

  return app;
}
