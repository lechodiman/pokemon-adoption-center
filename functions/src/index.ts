import * as cors from 'cors';
import * as express from 'express';
import { runWith } from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import * as path from 'path';
import adoptionRequestsRouter from './api/adoption-requests/router';
import pokemonRouter from './api/pokemon/router';
import { AdoptionRequestsService } from './services/adoption-requests-service';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(cors({ origin: true }));
app.use(pokemonRouter);
app.use(adoptionRequestsRouter);

export const api = onRequest(app);

export const onAdoptionRequestCreated = runWith({ timeoutSeconds: 300 })
  .firestore.document('adoptionRequests/{adoptionRequestID}')
  .onCreate(async (snapshot, context) => {
    const adoptionRequestId = context.params.adoptionRequestID;
    const pokemonID = snapshot.data().pokemonID;

    await AdoptionRequestsService.processPokemonDelivery({
      pokemonID,
      adoptionRequestId,
    });
  });
