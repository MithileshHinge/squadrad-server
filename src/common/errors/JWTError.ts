/**
 * Gets thrown when JWT verification fails
 */
class JWTError extends Error {
  type = 'JWTError';
}

export default JWTError;
