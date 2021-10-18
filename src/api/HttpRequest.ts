export type HTTPRequest = {
  body: any,
  query: object,
  params: object,
  method: HTTPRequestMethod,
  path: string,
  userId?: string,
};

export enum HTTPRequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}
