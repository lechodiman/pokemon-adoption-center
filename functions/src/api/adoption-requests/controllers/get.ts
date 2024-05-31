import { Request, Response } from 'express';
import * as logger from 'firebase-functions/logger';
import { AdoptionRequestsService } from '../../../services/adoption-requests-service';

export async function get(req: Request, res: Response) {
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
}
