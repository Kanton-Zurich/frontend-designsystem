export default interface LoginResponse {
  token: string;
  _links: {
    self: any;
    find: any;
  }
}
