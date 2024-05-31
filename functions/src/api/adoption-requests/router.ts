import { Router } from 'express';
import { handleAdoptionRequest } from './controllers/create';
import { get } from './controllers/get';

const adoptionRequestsRouter = Router();

adoptionRequestsRouter.post('/adoption-request', handleAdoptionRequest);
adoptionRequestsRouter.get('/adoption-request/:id', get);

export default adoptionRequestsRouter;
