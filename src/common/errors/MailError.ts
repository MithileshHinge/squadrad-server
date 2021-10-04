/**
 * Gets thrown when mailer fails to send mail
 */
class MailError extends Error {
  type = 'MailError';
}

export default MailError;
