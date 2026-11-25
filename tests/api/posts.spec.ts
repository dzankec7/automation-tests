import { test, expect } from '../../src/fixtures';
import { NewPost, PostSchema } from '../../src/api/schemas/post.schema';

/**
 * jsonplaceholder is a fake: POST /posts answers 201 with a new id, but nothing
 * is stored, so GET of that id returns 404. We assert what the service actually
 * guarantees and pin the non-persistence explicitly (see README, Design decisions).
 */
test.describe('POST /posts then GET it back', () => {
  test('create returns the post with a new id; fake service does not persist it', {
    tag: ['@regression'],
    annotation: {
      type: 'note',
      description: 'jsonplaceholder does not persist writes; read-back is expected to be 404. On a real service assert GET == created post.',
    },
  }, async ({ postsClient }) => {
    const newPost: NewPost = { userId: 1, title: `qa title ${Date.now()}`, body: 'qa body' };

    const created = await postsClient.createPost(newPost);

    expect(created.status).toBe(201);
    const post = PostSchema.parse(created.body);
    expect(post).toEqual({ ...newPost, id: post.id });

    const readBack = await postsClient.getPost(post.id);
    // If this ever becomes 200 the service started persisting: switch this to
    // expect(readBack.body).toEqual(post) and drop the note above.
    expect(readBack.status, 'fake service: created post is not persisted').toBe(404);
  });

  test('GET of an existing post matches the Post schema', { tag: ['@smoke', '@regression'] }, async ({ postsClient }) => {
    const { status, body } = await postsClient.getPost(1);

    expect(status).toBe(200);
    expect(PostSchema.parse(body).id).toBe(1);
  });
});
