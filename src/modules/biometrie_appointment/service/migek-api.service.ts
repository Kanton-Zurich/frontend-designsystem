import { ReservationDetails } from '../model/reservation-details.model';

export class ApiForbidden implements Error {
  name: 'Forbidden';
  message: 'Could not authenticate access token';
}

class MigekApiService {
  private apiBasePath: string;
  private bearerStr: string;

  private log: Function = () => undefined;

  constructor(_apiBasePath: string, private _loggingFn?: Function) {
    this.apiBasePath = _apiBasePath;
    if (_loggingFn) {
      this.log = _loggingFn;
    }
  }

  public login(loginToken: string): Promise<ReservationDetails> {
    const loginPath = 'login';
    const body = this.getLoginRequestBody(loginToken);
    return this.doPost(loginPath, body).then((respObj) => {
      const loginResp = respObj as LoginResponse;
      this.bearerStr = loginResp.token;
      // eslint-disable-next-line no-underscore-dangle
      const pathToReservationDetails = new URL(loginResp._links.find.href).pathname;
      return this.doGet(pathToReservationDetails).then((responseObj) => {
        const detailResp = responseObj as ReservationDetailResponse;
        return detailResp.reservation as ReservationDetails;
      });
    }).catch(e => this.log(e));
  }

  private getLoginRequestBody(tokenStr: string) {
    return JSON.stringify({
      token: tokenStr,
    });
  }

  private doGet(path: string): Promise<any> {
    return this.doSendXhr('GET', path);
  }

  private doPost(path: string, jsonBody: any): Promise<any> {
    return this.doSendXhr('POST', path, jsonBody);
  }

  private doSendXhr(method: HttpMethod, path: string, jsonBody?: any): Promise<any> {
    const url = this.apiBasePath + path;
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (e) {
              reject(new Error('Unable to parse response')); // TODO
            }
            resolve(xhr.response);
          } else if (xhr.status === 403) {
            reject(ApiForbidden);
          } else {
            reject(new Error('API connection failure')); // TODO
          }
        }
      };
      xhr.open(method, url, true);

      if (jsonBody) {
        xhr.setRequestHeader('Content-Type', 'application/json');
      }

      if (this.bearerStr) {
        xhr.setRequestHeader('Authorization', `Bearer ${this.bearerStr}`);
      }

      xhr.setRequestHeader('Accept', 'application/hal+json;charset=UTF-8');
      xhr.send(jsonBody);
    });
  }
}

interface LoginResponse {
  token: string;
  _links: {
    self: PayloadLinkObject;
    find: PayloadLinkObject;
  }
}

interface ReservationDetailResponse {
  reservation: ReservationDetails;
  _links: {
    self: PayloadLinkObject;
    postpone: PayloadLinkObject;
  }
}

interface PayloadLinkObject {
  href: string;
  type: HttpMethod;
}

// TODO: Limit method to those which are actually used
type HttpMethod = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD';

export default MigekApiService;
