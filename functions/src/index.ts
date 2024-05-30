import * as cors from 'cors';
import * as express from 'express';
import { runWith } from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import * as path from 'path';
import adoptionRequestsRouter from './api/adoption-requests/router';
import pokemonRouter from './api/pokemon/router';
import { AdoptionRequestsService } from './services/adoption-requests-service';
import rateLimit from 'express-rate-limit';
import AdoptionRequestSchema from './services/adoption-requests-service/models/adoption-request';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(cors({ origin: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

app.use(limiter);

app.use(pokemonRouter);
app.use(adoptionRequestsRouter);

export const api = onRequest(app);

export const onAdoptionRequestCreated = runWith({ timeoutSeconds: 300 })
  .firestore.document('adoptionRequests/{adoptionRequestID}')
  .onCreate(async (snapshot) => {
    const adoptionRequest = AdoptionRequestSchema.parse({
      id: snapshot.id,
      ...snapshot.data(),
    });

    await AdoptionRequestsService.processPokemonDelivery({
      adoptionRequest,
    });
  });
