import cuid from 'cuid';

export interface IId {
  createId(): string,
  isValidId(id: string): boolean,
  createSlug(): string,
  isValidSlug(slug: string): boolean,
}

const id: IId = {
  createId: (): string => cuid(),
  isValidId: (idToCheck: string): boolean => cuid.isCuid(idToCheck),
  createSlug: (): string => cuid.slug(),
  isValidSlug: (slugToCheck: string): boolean => cuid.isSlug(slugToCheck),
};

export default id;
