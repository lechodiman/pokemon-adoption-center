import * as logger from 'firebase-functions/logger';
import { BlockedUsersService } from '../../blocked-users-service';
import { areLastAdoptionsRejected, determineAdoptionEligibility } from './can-adopt';
import { rejectAdoptionRequest } from './reject-adoption-request';
import { submitAdoptionRequest } from './submit-adoption-request';

export async function adoptPokemon({
  rut,
  name,
  lastname,
  address,
  description,
  pokemonID,
}: {
  rut: string;
  name: string;
  lastname: string;
  address: string;
  description: string;
  pokemonID: string;
}) {
  const isUserBlocked = await BlockedUsersService.isUserBlocked(rut);

  if (isUserBlocked) {
    logger.warn('User is blocked:', rut);
    return null;
  }

  const allRejected = await areLastAdoptionsRejected(rut);

  if (allRejected) {
    logger.warn('User has too many consecutive rejections:', rut);
    logger.warn('User is being blocked:', rut);
    await BlockedUsersService.blockUser(rut);
    return null;
  }

  const canAdoptPokemon = await determineAdoptionEligibility(rut);

  if (!canAdoptPokemon) {
    await rejectAdoptionRequest({
      name,
      lastname,
      address,
      rut,
      description,
      pokemonID,
    });

    return null;
  }

  const adoptionId = await submitAdoptionRequest(pokemonID, {
    name,
    lastname,
    address,
    rut,
    description,
  });

  return adoptionId;
}
