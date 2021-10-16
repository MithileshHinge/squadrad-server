export type HTTPRequest = {
  body: any,
  query: Object,
  params: Object,
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
