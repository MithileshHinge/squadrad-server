/* eslint-disable no-bitwise */
import crypto from 'crypto';

export interface IId {

  /**
   * Generates a 12 byte unique id
   *
   * - 4 bytes - Timestamp value in seconds since Unix epoch
   * - 5 bytes - crypto random value
   * - 3 bytes - incrementing counter, initialized to random value
   *
   * @returns 12 byte Hex string
   */
  createId(): string,

  isValidId(id: string): boolean,
}

let counter = Math.floor(Math.random() * 0xffffff);
const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');

const id: IId = {
  createId() {
    const buf = Buffer.alloc(12);
    const seconds = Math.floor(Date.now() / 1000);
    const randomBytes = crypto.randomBytes(5);
    counter = (counter + 1) % 0xffffff;

    buf.writeUInt32BE(seconds);
    [buf[4], buf[5], buf[6], buf[7], buf[8]] = randomBytes;

    buf[9] = (counter >> 16) & 0xff;
    buf[10] = (counter >> 8) & 0xff;
    buf[11] = counter & 0xff;

    return buf.toString('hex');
  },

  isValidId(idToCheck: string) {
    return (idToCheck.length === 24 && checkForHexRegExp.test(idToCheck));
  },
};

export default id;
