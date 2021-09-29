export interface IUser {
  getId(): string,
  getFullName?(): string,
  getEmail?(): string,
  getPassword?(): string,
  getProfilePic(): string,
}
