import 'dotenv/config';

/**
 * Single place where configuration is read. Values come from the environment
 * (.env locally, secrets in CI). Nothing has a hard-coded fallback: a missing
 * value fails fast with a clear message instead of silently using a default.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env variable "${name}". Did you run "cp .env.example .env"?`);
  }
  return value;
}

export const env = {
  uiBaseUrl: required('UI_BASE_URL'),
  apiBaseUrl: required('API_BASE_URL'),
  password: required('SAUCE_PASSWORD'),
  users: {
    standard: required('SAUCE_STANDARD_USER'),
    problem: required('SAUCE_PROBLEM_USER'),
  },
} as const;

export type UserKey = keyof typeof env.users;

/** Where the setup project stores the logged-in browser state for a user. */
export const authFile = (user: UserKey) => `.auth/${user}.json`;
