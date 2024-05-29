import { z } from 'zod';

export const ADOPTION_STATUS = {
  SUCCESS: 'success',
  TRANSPORTATION: 'transportation',
  FAILURE: 'failure',
  PREPARATION: 'preparation',
} as const;

const AdoptionRequestSchema = z.object({
  id: z.string(),
  address: z.string(),
  description: z.string(),
  lastname: z.string(),
  name: z.string(),
  pokemonID: z.string(),
  rut: z.string(),
  status: z.union([
    z.literal(ADOPTION_STATUS.SUCCESS),
    z.literal(ADOPTION_STATUS.TRANSPORTATION),
    z.literal(ADOPTION_STATUS.FAILURE),
    z.literal(ADOPTION_STATUS.PREPARATION),
  ]),
});

export type AdoptionRequest = z.infer<typeof AdoptionRequestSchema>;

export default AdoptionRequestSchema;
