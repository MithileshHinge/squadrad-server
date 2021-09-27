export interface IEncryptionService {
  encrypt(password: string): string;
  compare(password: string, hash: string): boolean;
}
