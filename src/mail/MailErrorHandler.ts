import MailError from '../common/errors/MailError';

export default function handleMailError(err: any, message: string) {
  const mailError = new MailError(message);
  mailError.stack = err.stack;
  throw mailError;
}
