import Appointment from '../model/appointment.model';

// TODO: Interfaces an enums are marked as unused by eslint (?)
/* eslint-disable no-unused-vars */
import {
  AppointmentDetailsResponse,
  AppointmentPayload, ErrorResponse,
  LoginResponse, PostponeResponse, TimeslotPayload,
  TimeslotsResponse,
} from '../model/api-payload.interfaces';

export enum ApiFailureType {
  FORBIDDEN,
  UNCHANGED_RESERVATION,
  SLOT_FULL,
  INVALID_PARAMS,
  UNKNOWN,
  UNPARSEABLE,
}
/* eslint-enable no-unused-vars */

export class ApiConnectionFailure implements Error {
  name: 'Connection failure - MigekApi';
  message: string;
  type: ApiFailureType;

  constructor(_type: ApiFailureType, _msg?: string) {
    this.message = _msg;
    this.type = _type;
  }
}
export class ApiForbidden extends ApiConnectionFailure {
  constructor() {
    super(ApiFailureType.FORBIDDEN);
  }
}
export class UnparseableResponseException extends ApiConnectionFailure {
  unparseable: string;
  constructor(_unparseable: string) {
    super(ApiFailureType.UNPARSEABLE, 'API response body could not be parsed.');
    this.unparseable = _unparseable;
  }
}
const HttpStatusCodes = {
  OK: 200,
  MULTIPLE: 300,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
};
class MigekApiService {
  private static readonly FAILURE_MSG_UNCHANGED = 'The start and end time of the reservation is unchanged';
  private static readonly FAILURE_MSG_SLOTFULL = 'The time slot is fully booked';

  private apiBasePath: string;
  private bearerStr: string;

  private currentAppointment: AppointmentPayload;

  private pathToReservationDetails: string;
  private postponePath: string;
  private confirmationPath: string;

  private log: Function = () => undefined;

  constructor(_apiBasePath: string, private _loggingFn?: Function) {
    this.apiBasePath = _apiBasePath;
    if (_loggingFn) {
      this.log = _loggingFn;
    }
  }

  public getStatus(): Promise<boolean> {
    const url = `${this.apiBasePath}api/status`;
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status >= HttpStatusCodes.OK && xhr.status < HttpStatusCodes.MULTIPLE) {
            resolve(true);
          } else {
            reject(this.handleConnectionFailure(xhr));
          }
        }
      };
      xhr.open('GET', url, true);
      xhr.send();
    });
  }

  public login(loginToken: string): Promise<Appointment> {
    const loginPath = 'login';
    const body = this.getLoginRequestBody(loginToken);
    return this.doPost(loginPath, body).then((respObj) => {
      const loginResp = respObj as LoginResponse;
      this.bearerStr = loginResp.token;
      // eslint-disable-next-line no-underscore-dangle
      this.pathToReservationDetails = loginResp._links.find.href;
      return this.getReservationDetails();
    });
  }

  public getReservationDetails(): Promise<Appointment> {
    if (!this.pathToReservationDetails) {
      throw new Error('Unexpected runtime error'); // TODO
    }
    return this.doGet(this.pathToReservationDetails).then((responseObj) => {
      const detailResp = responseObj as AppointmentDetailsResponse;
      // eslint-disable-next-line no-underscore-dangle
      this.postponePath = detailResp._links.postpone.href;

      this.currentAppointment = detailResp.reservation;
      return new Appointment(this.currentAppointment);
    });
  }

  // TODO: Konstanten rausziehen.
  public getTimeSlots(notBeforeDate?: Date): Promise<TimeslotPayload[]> {
    let path = 'api/v1/timeslots/?days=7';
    if (notBeforeDate) {
      const notBeforeIsoString = notBeforeDate.toISOString();
      const toIdx = notBeforeIsoString.indexOf('T');
      const notBeforeVal = notBeforeIsoString.substring(0, toIdx);
      path += `&notBefore=${notBeforeVal}`;
    }
    return this.doGet(path).then((respObj) => {
      const resp = respObj as TimeslotsResponse;
      return resp.timeSlots;
    });
  }

  public rescheduleTo(startTime: string, endTime: string): Promise<Appointment> {
    if (!this.currentAppointment || !this.bearerStr) {
      throw new Error('Unexpected runtime error');
    }
    return this.doPost(this.postponePath, this.getPostponeRequestBody(startTime, endTime))
      .then((resp) => {
        const postponeResp = resp as PostponeResponse;
        this.currentAppointment = postponeResp.reservation;

        // eslint-disable-next-line no-underscore-dangle
        this.confirmationPath = postponeResp._links.confirmation.href;
        return new Appointment(this.currentAppointment);
      });
  }

  public triggerConfirmationDownload(): void {
    if (this.confirmationPath && this.bearerStr) {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status >= HttpStatusCodes.OK && xhr.status < HttpStatusCodes.MULTIPLE) {
            this.log('Response: ', xhr.response);
            const arrayBuffer = xhr.response;
            const file = new Blob([arrayBuffer], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);

            const hiddenA = document.createElement('a');
            hiddenA.style.display = 'none';
            hiddenA.href = fileURL;
            hiddenA.download = 'Bestätigung_Biometrie.pdf'; // TODO Filename konfigurierbar
            document.body.appendChild(hiddenA);
            hiddenA.click();

            hiddenA.remove();
            URL.revokeObjectURL(fileURL);
          } else {
            throw new Error('API connection failure'); // TODO
          }
        }
      };

      xhr.responseType = 'arraybuffer';
      xhr.open('GET', this.confirmationPath, true);

      if (this.bearerStr) {
        xhr.setRequestHeader('Authorization', `Bearer ${this.bearerStr}`);
      }
      xhr.setRequestHeader('Accept', 'application/pdf');
      xhr.send();
    }
  }

  public logoutReset(): void {
    this.bearerStr = undefined;
    this.currentAppointment = undefined;
    this.pathToReservationDetails = undefined;
    this.postponePath = undefined;
    this.confirmationPath = undefined;
    window.location.reload();
  }

  private getLoginRequestBody(tokenStr: string): string {
    return JSON.stringify({
      token: tokenStr,
    });
  }

  private getPostponeRequestBody(startTime: string, endTime: string): string {
    if (this.currentAppointment) {
      const reqAppointment = Object.assign({}, this.currentAppointment, {
        from: startTime,
        until: endTime,
      });
      return JSON.stringify(reqAppointment);
    }
    return '';
  }

  private doGet(path: string): Promise<any> {
    return this.doSendXhr('GET', path);
  }

  private doPost(path: string, jsonBody: any): Promise<any> {
    return this.doSendXhr('POST', path, jsonBody);
  }

  private doSendXhr(method: HttpMethod, href: string, jsonBody?: any): Promise<any> {
    let url = href;
    if (!url.startsWith('http')) {
      url = this.apiBasePath + href;
    }
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status >= HttpStatusCodes.OK && xhr.status < HttpStatusCodes.MULTIPLE) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch (e) {
              reject(new UnparseableResponseException(xhr.responseText));
            }
          } else {
            reject(this.handleConnectionFailure(xhr));
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

  private handleConnectionFailure(xhr: XMLHttpRequest): ApiConnectionFailure {
    let failure = new ApiConnectionFailure(ApiFailureType.UNKNOWN, 'Unexpected API connection failure!');
    if (xhr.status === HttpStatusCodes.FORBIDDEN) {
      failure = new ApiForbidden();
    } else if (xhr.status === HttpStatusCodes.BAD_REQUEST) {
      try {
        const errorResponse = JSON.parse(xhr.responseText) as ErrorResponse;
        const { message } = errorResponse;
        if (message === MigekApiService.FAILURE_MSG_UNCHANGED) {
          failure = new ApiConnectionFailure(ApiFailureType.UNCHANGED_RESERVATION, message);
        } else if (message === MigekApiService.FAILURE_MSG_SLOTFULL) {
          failure = new ApiConnectionFailure(ApiFailureType.SLOT_FULL, message);
        } else {
          failure = new ApiConnectionFailure(ApiFailureType.INVALID_PARAMS, message);
        }
      } catch (e) {
        failure = new UnparseableResponseException(xhr.responseText);
      }
    }
    this.log(failure);
    return failure;
  }
}

// TODO: Limit method to those which are actually used
type HttpMethod = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD';

export default MigekApiService;
