import * as cors from 'cors';
import * as express from 'express';
import { firestore } from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import adoptionRequestsRouter from './api/adoption-requests/router';
import pokemonRouter from './api/pokemon/router';
import { AdoptionRequestsService } from './services/adoption-requests-service';
import * as path from 'path';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

app.use(cors({ origin: true }));
app.use(pokemonRouter);
app.use(adoptionRequestsRouter);

export const api = onRequest(app);

export const onAdoptionRequestCreated = firestore
  .document('adoptionRequests/{adoptionRequestID}')
  .onCreate(async (snapshot, context) => {
    const adoptionRequestId = context.params.adoptionRequestID;
    const pokemonID = snapshot.data().pokemonID;

    await AdoptionRequestsService.processPokemonDelivery({
      pokemonID,
      adoptionRequestId,
    });
  });
