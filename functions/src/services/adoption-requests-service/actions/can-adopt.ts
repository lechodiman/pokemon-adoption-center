import { findPreviousSuccessfulAdoptions } from './find-previous-adoptions';

export async function canAdopt(rut: string): Promise<boolean> {
  const previousAdoptions = await findPreviousSuccessfulAdoptions(rut);
  const hasPreviousSuccess = !previousAdoptions.empty;
  const successProbability = hasPreviousSuccess ? 0.9 : 0.5;
  const willAdopt = Math.random() < successProbability;
  return willAdopt;
}
