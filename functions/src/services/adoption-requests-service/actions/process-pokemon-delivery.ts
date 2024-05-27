import * as logger from 'firebase-functions/logger';
import { PokemonService } from '../../pokemon-service';
import { updateAdoptionRequest } from './update-adoption-request';
import { delay, getRandomTimeInMilliseconds } from '../../utils';

const MAX_TRANSPORTATION_TIME_MINUTES = 3;
const MIN_TRANSPORTATION_TIME_MINUTES = 1;
const ONE_MINUTE_MS = 60 * 1000;

export async function processPokemonDelivery({
  pokemonID,
  adoptionRequestId,
}: {
  pokemonID: string;
  adoptionRequestId: string;
}) {
  logger.info(`New adoption request created with id: ${adoptionRequestId}`);

  await delay(ONE_MINUTE_MS);

  logger.info(
    `Changing status to 'transportation' for adoption request id: ${adoptionRequestId}`
  );
  await updateAdoptionRequest(adoptionRequestId, {
    status: 'transportation',
  });

  const transportationTime = getRandomTimeInMilliseconds(
    MIN_TRANSPORTATION_TIME_MINUTES,
    MAX_TRANSPORTATION_TIME_MINUTES
  );

  logger.info(
    `Transportation time for adoption request id: ${adoptionRequestId}: ${transportationTime}ms`
  );

  await delay(transportationTime);

  const isSuccess = Math.random() < 0.95;
  const newStatus = isSuccess ? 'success' : 'failure';

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
}
