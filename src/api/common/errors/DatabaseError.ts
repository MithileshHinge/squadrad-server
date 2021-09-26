/**
 * Gets thrown when error occurs in database framework
 */
class DatabaseError extends Error {
  type = 'DatabaseError';
}

export default DatabaseError;
