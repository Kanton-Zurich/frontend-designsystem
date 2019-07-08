import LoginResponse from '../model/login-response.interface';

export class ApiForbidden implements Error {
  name: 'Forbidden';
  message: 'Could not authenticate access token';
}

class MigekApiService {

  private apiBasePath: string;

  private log: Function = () => undefined;

  constructor(_apiBasePath: string, private _loggingFn?: Function) {
    this.apiBasePath = _apiBasePath;
    if (_loggingFn) {
      this.log = _loggingFn;
    }
  }

  public login(loginToken: string): Promise<LoginResponse> {
    const loginUrl = `${this.apiBasePath}login`;
    const body = this.getLoginRequestBody(loginToken);
    return this.doPost(loginUrl, body).then(respObj => respObj as LoginResponse)
      .catch(e => this.log(e));
  }

  private getLoginRequestBody(tokenStr: string) {
    return JSON.stringify({
      token: tokenStr,
    });
  }

  private doPost(url: string, jsonBody: any): Promise<any> {
    return this.doSendXhr('POST', url, jsonBody);
  }

  private doSendXhr(method: 'POST' | 'GET', url: string, jsonBody?: any): Promise<any> {
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
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Accept', 'application/hal+json;charset=UTF-8');
      xhr.send(jsonBody);
    });
  }
}

export default MigekApiService;
