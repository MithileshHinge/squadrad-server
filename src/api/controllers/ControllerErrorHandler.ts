import AuthenticationError from '../../common/errors/AuthenticationError';
import JWTError from '../../common/errors/JWTError';
import ValidationError from '../../common/errors/ValidationError';
import { HTTPResponse, HTTPResponseCode } from '../HttpResponse';

export default function handleControllerError(err: Error): HTTPResponse {
  if (process.env.NODE_ENV !== 'test') console.log(err);
  switch (err.constructor) {
    case ValidationError:
      return { statusCode: HTTPResponseCode.BAD_REQUEST, body: {} };
      break;
    case JWTError:
      if (err.message === 'Token expired') return { statusCode: HTTPResponseCode.FORBIDDEN, body: {} };
      return { statusCode: HTTPResponseCode.BAD_REQUEST, body: {} };
      break;
    case AuthenticationError:
      return { statusCode: HTTPResponseCode.UNAUTHORIZED, body: {} };
      break;
    default:
      return { statusCode: HTTPResponseCode.INTERNAL_SERVER_ERROR, body: {} };
      break;
  }
}
