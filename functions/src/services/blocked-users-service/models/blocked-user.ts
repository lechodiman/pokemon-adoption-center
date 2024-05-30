import { z } from 'zod';

const BlockedUserSchema = z.object({
  rut: z.string(),
  createdAt: z.string().transform((value) => new Date(value)),
});

const NewBlockedUserSchema = BlockedUserSchema.pick({ rut: true }).merge(
  z.object({ createdAt: z.string() })
);

export type NewBlockedUser = z.infer<typeof NewBlockedUserSchema>;

export type BlockedUser = z.infer<typeof BlockedUserSchema>;

export default BlockedUserSchema;
