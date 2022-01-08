export type HTTPResponse = {
  statusCode?: HTTPResponseCode,
  body?: any,
  file?: string,
};

export enum HTTPResponseCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
