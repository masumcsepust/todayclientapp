export class RegisterWithExternal {
  firstname: string;
  lastname: string;
  userId: string;
  accessToken: string;
  provider: string;
  constructor(firstname: string, lastname: string, userId: string, accessToken: string, provider: string) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.userId = userId;
    this.accessToken = accessToken;
    this.provider = provider;
  }
}
