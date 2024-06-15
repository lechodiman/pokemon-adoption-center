import { z } from 'zod';

export const ADOPTION_STATUS = {
  PREPARATION: 'preparation',
  TRANSPORTATION: 'transportation',
  FAILURE: 'failure',
  SUCCESS: 'success',
  REJECTED: 'rejected',
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
    z.literal(ADOPTION_STATUS.REJECTED),
  ]),
  createdAt: z.string().transform((value) => new Date(value)),
});

const NewAdoptionRequestSchema = AdoptionRequestSchema.omit({
  id: true,
  createdAt: true,
});

export type AdoptionRequest = z.infer<typeof AdoptionRequestSchema>;

export type NewAdoptionRequest = z.infer<typeof NewAdoptionRequestSchema>;

export default AdoptionRequestSchema;
