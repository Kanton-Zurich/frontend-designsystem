export interface LoginResponse {
  token: string;
  _links: {
    self: PayloadLinkObject;
    find: PayloadLinkObject;
  }
}

export interface AppointmentDetailsResponse {
  reservation: AppointmentPayload;
  _links: {
    self: PayloadLinkObject;
    postpone: PayloadLinkObject;
  }
}

export interface TimeslotsResponse {
  timeSlots: TimeslotPayload[];
  _links: {
    self: PayloadLinkObject;
    next: PayloadLinkObject;
  }
}

export interface PayloadLinkObject {
  href: string;
  type: string;
}

export interface AppointmentPayload {
  id: number;
  from: string;
  until: string;
  lastName: string;
  firstName: string;
  dateOfBirth: string;
}

export interface TimeslotPayload {
  startTime: string;
  endTime: string;
  capacity: number;
}
