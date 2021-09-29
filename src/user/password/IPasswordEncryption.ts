export interface IPasswordEncryption {
  encrypt(password: string): string;
  compare(password: string, hash: string): boolean;
}
