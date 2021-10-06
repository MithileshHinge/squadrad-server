/**
 * Gets thrown when credentials are incorrect or email address is not verified
 */
class AuthenticationError extends Error {
  type = 'AuthenticationError';
}

export default AuthenticationError;
