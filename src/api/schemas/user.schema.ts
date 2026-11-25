import { z } from 'zod';

/**
 * Contract of GET /users/{id}. `.strict()` makes unexpected extra fields a
 * failure too, so the schema catches both missing and new/renamed fields.
 * The TS type is inferred from it: schema and type can never drift apart.
 */
const nonEmpty = z.string().min(1);

export const UserSchema = z
  .object({
    id: z.number().int().positive(),
    name: nonEmpty,
    username: nonEmpty,
    email: z.email(),
    address: z
      .object({
        street: nonEmpty,
        suite: nonEmpty,
        city: nonEmpty,
        zipcode: nonEmpty,
        geo: z.object({ lat: nonEmpty, lng: nonEmpty }).strict(),
      })
      .strict(),
    phone: nonEmpty,
    website: nonEmpty,
    company: z.object({ name: nonEmpty, catchPhrase: nonEmpty, bs: nonEmpty }).strict(),
  })
  .strict();

export type User = z.infer<typeof UserSchema>;
