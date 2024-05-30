import * as logger from 'firebase-functions/logger';
import { PokemonService } from '../../pokemon-service';
import { updateAdoptionRequest } from './update-adoption-request';
import { delay, getRandomTimeInMilliseconds } from '../../utils';
import { ADOPTION_STATUS, AdoptionRequest } from '../models/adoption-request';

export async function processPokemonDelivery({
  adoptionRequest,
}: {
  adoptionRequest: AdoptionRequest;
}) {
  const { id: adoptionRequestId, pokemonID, status } = adoptionRequest;
  logger.info(`New adoption request created with id: ${adoptionRequestId}`);

  if (status === 'failure') {
    logger.info(
      `Adoption request id: ${adoptionRequestId} is already in 'failure' status`
    );
    return;
  }

  try {
    await delay(ONE_MINUTE_MS);

    logger.info(
      `Changing status to 'transportation' for adoption request id: ${adoptionRequestId}`
    );
    await updateAdoptionRequest(adoptionRequestId, {
      status: ADOPTION_STATUS.TRANSPORTATION,
    });

    const transportationTime = getRandomTimeInMilliseconds(
      MIN_TRANSPORTATION_TIME_MINUTES,
      MAX_TRANSPORTATION_TIME_MINUTES
    );

    logger.info(
      `Transportation time for adoption request id: ${adoptionRequestId}: ${transportationTime}ms`
    );

    await delay(transportationTime);

    const isSuccess = Math.random() < DELIVERY_SUCCESS_RATE;
    const newStatus = isSuccess ? ADOPTION_STATUS.SUCCESS : ADOPTION_STATUS.FAILURE;

    logger.info(
      `Changing status to '${newStatus}' for adoption request id: ${adoptionRequestId}`
    );
    await updateAdoptionRequest(adoptionRequestId, {
      status: newStatus,
    });

    if (!isSuccess) {
      logger.info(`Making pokemon id: ${pokemonID} available again`);
      await PokemonService.updatePokemon(pokemonID, { available: true });
    }
  } catch (error) {
    logger.error(`Error processing pokemon delivery: ${error}`);
    throw error;
  }
}

const MAX_TRANSPORTATION_TIME_MINUTES = 3;
const MIN_TRANSPORTATION_TIME_MINUTES = 1;
const ONE_MINUTE_MS = 60 * 1000;
const DELIVERY_SUCCESS_RATE = 0.95;
