import jwt, { TokenExpiredError } from 'jsonwebtoken';
import JWTError from './errors/JWTError';
import { JWT_SECRET } from './secretKeys';

/**
 * Issue and sign a new JSON Web Token
 * @param payload Json contents
 * @param expiresIn Time limit in seconds from current time
 * @returns Cryptographically signed (non-encrypted) token string
 */
export const issueJWT = (
  payload: any,
  expiresIn: number,
): string => jwt.sign(payload, JWT_SECRET, { expiresIn });

/**
 * Verify a JSON Web Token
 * @param token Signed unencrypted token string
 * @throws JWTError (message: 'Token expired' or 'Invalid token')
 */
export const verifyJWT = (
  token: string,
): Promise<any> => new Promise((resolve, reject) => {
  jwt.verify(token, JWT_SECRET, {}, (err, data) => {
    if (err) {
      if (err instanceof TokenExpiredError) reject(new JWTError('Token expired'));
      reject(new JWTError('Invalid token'));
    }
    resolve(data);
  });
});
