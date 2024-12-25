import { genSalt, hash } from 'bcrypt';

/**
 * Hashes a passed string
 * @param password
 * @returns
 */
export async function hashPass(password: string) {
  const salt = await genSalt(10);
  const hashed = await hash(password, salt);
  return hashed;
}
