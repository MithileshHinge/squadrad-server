import fs from 'fs-extra';
import crypto from 'crypto';
import { HTTPRequest } from '../HttpRequest';
import { HTTPResponseCode } from '../HttpResponse';
import handleControllerError from './ControllerErrorHandler';
import { IBaseController } from './IBaseController';

const getLandingBeacon: IBaseController = async (httpRequest: HTTPRequest) => {
  try {
    const { ref } = httpRequest.params;
    fs.writeJSONSync(`landingBeacon${crypto.randomUUID()}.json`, {
      timestamp: (new Date()).toLocaleString('en-IN'),
      beacon: 'landing',
      ref,
      httpRequest,
    });
    return {
      statusCode: HTTPResponseCode.OK,
      body: {},
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
};

export default {
  getLandingBeacon,
};
