export interface IUser {
  getId(): string,
  getFullName(): string,
  getEmail(): string,
  getPassword(): string | undefined,
  setFullName(fullName: string): void,
  setPassword(password: string): void,
}
