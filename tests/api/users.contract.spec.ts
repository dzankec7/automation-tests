import { test, expect } from '../../src/fixtures';
import { UserSchema } from '../../src/api/schemas/user.schema';

test.describe('GET /users/{id} contract', () => {
  for (const id of [1, 10]) {
    test(`user ${id} matches the User schema`, { tag: ['@smoke', '@regression'] }, async ({ usersClient }) => {
      const { status, body } = await usersClient.getUser(id);

      expect(status).toBe(200);
      const result = UserSchema.safeParse(body);
      // On failure, print every violation at once instead of the first mismatch.
      expect(result.success, result.error ? JSON.stringify(result.error.issues, null, 2) : '').toBe(true);
      expect(result.data?.id).toBe(id);
    });
  }
});
