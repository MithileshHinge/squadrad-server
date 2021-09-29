/**
 * Gets thrown when parameter validations fail
 */
class ValidationError extends Error {
  type = 'ValidationError';
}

export default ValidationError;
