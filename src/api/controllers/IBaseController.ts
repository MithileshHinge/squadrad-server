import { HTTPRequest } from '../HttpRequest';
import { HTTPResponse } from '../HttpResponse';

export type IBaseController = (httpRequest: HTTPRequest) => Promise<HTTPResponse>;
