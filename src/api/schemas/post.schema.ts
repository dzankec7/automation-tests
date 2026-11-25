import { z } from 'zod';

export const NewPostSchema = z
  .object({
    userId: z.number().int().positive(),
    title: z.string().min(1),
    body: z.string().min(1),
  })
  .strict();

export const PostSchema = NewPostSchema.extend({ id: z.number().int().positive() }).strict();

export type NewPost = z.infer<typeof NewPostSchema>;
export type Post = z.infer<typeof PostSchema>;
