export type HTTPRequest = {
  body: any,
  query: any,
  params: any,
  method: HTTPRequestMethod,
  path: string,
  userId?: string,
  files: string[] | undefined,
};

export enum HTTPRequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}
