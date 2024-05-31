import { runWith } from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import { createExpressApp } from './config/express-app';
import { AdoptionRequestsService } from './services/adoption-requests-service';
import AdoptionRequestSchema from './services/adoption-requests-service/models/adoption-request';

const app = createExpressApp();
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
