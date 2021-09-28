export interface IUser {
  getId(): string,
  getFullName(): string,
  getEmail(): string,
  getPassword(): string | undefined,
  getProfilePic(): string,
}
