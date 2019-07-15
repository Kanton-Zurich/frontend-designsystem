import Appointment from '../model/appointment.model';
import Timeslot, { TimeslotPayload } from '../model/timeslot.model';

export class ApiForbidden implements Error {
  name: 'Forbidden';
  message: 'Could not authenticate access token';
}

class MigekApiService {
  private apiBasePath: string;
  private bearerStr: string;

  private currentAppointment: AppointmentPayload;
  private postponePath: string;

  private log: Function = () => undefined;

  constructor(_apiBasePath: string, private _loggingFn?: Function) {
    this.apiBasePath = _apiBasePath;
    if (_loggingFn) {
      this.log = _loggingFn;
    }
  }

  public login(loginToken: string): Promise<Appointment> {
    const loginPath = 'login';
    const body = this.getLoginRequestBody(loginToken);
    return this.doPost(loginPath, body).then((respObj) => {
      const loginResp = respObj as LoginResponse;
      this.bearerStr = loginResp.token;
      // eslint-disable-next-line no-underscore-dangle
      const pathToReservationDetails = new URL(loginResp._links.find.href).pathname;
      return this.doGet(pathToReservationDetails).then((responseObj) => {
        const detailResp = responseObj as AppointmentDetailsResponse;
        // eslint-disable-next-line no-underscore-dangle
        this.postponePath = new URL(detailResp._links.postpone.href).pathname;

        this.currentAppointment = detailResp.reservation;
        return new Appointment(this.currentAppointment);
      });
    });
  }

  public getTimeSlots(): Promise<TimeslotPayload[]> {
    return this.doGet('api/v1/timeslots/?days=10').then((respObj) => {
      const resp = respObj as TimeslotsResponse;
      return resp.timeSlots;
    });
  }

  public rescheduleToTimeslot(timeslot: Timeslot) {
    if (this.currentAppointment && this.bearerStr) {
      this.doPost(this.postponePath, this.getPostponeRequestBody(timeslot))
        .then((resp) => {
          console.log(resp);
        });
    }
  }

  public openConfirmationPDF(): void {
    if (this.currentAppointment && this.bearerStr) {
      const pathToConfirmation = `api/v1/confirmations/${this.currentAppointment.id}`;
      const reqUrl = this.apiBasePath + pathToConfirmation;

      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status >= 200 && xhr.status < 300) {
            const arrayBuffer = xhr.response;
            const file = new Blob([arrayBuffer], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
          } else {
            throw new Error('API connection failure'); // TODO
          }
        }
      };

      xhr.responseType = 'arraybuffer';
      xhr.open('GET', reqUrl, true);

      if (this.bearerStr) {
        xhr.setRequestHeader('Authorization', `Bearer ${this.bearerStr}`);
      }

      xhr.setRequestHeader('Accept', 'application/pdf');
      xhr.send();
    }
  }

  private getLoginRequestBody(tokenStr: string): string {
    return JSON.stringify({
      token: tokenStr,
    });
  }

  private getPostponeRequestBody(slot: Timeslot): string {
    if (this.currentAppointment) {
      const reqAppointment = Object.assign({}, this.currentAppointment);
      reqAppointment.from = slot.from;
      reqAppointment.until = slot.until;
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

interface AppointmentDetailsResponse {
  reservation: AppointmentPayload;
  _links: {
    self: PayloadLinkObject;
    postpone: PayloadLinkObject;
  }
}

interface TimeslotsResponse {
  timeSlots: TimeslotPayload[];
  _links: {
    self: PayloadLinkObject;
    next: PayloadLinkObject;
  }
}

interface PayloadLinkObject {
  href: string;
  type: HttpMethod;
}

// TODO: Limit method to those which are actually used
type HttpMethod = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD';

export default MigekApiService;
