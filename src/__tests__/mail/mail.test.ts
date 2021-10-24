import { closeMailTransporter } from '../../mail';
import emailVerification from '../../user/email-verification';
import getTestAccount from '../__mocks__/mail/mockMailAccount';

jest.unmock('../../mail');

describe('Mail test', () => {
  let testAccount: { email: string, password: string };

  beforeAll(async () => {
    jest.setTimeout(15000);
    try {
      testAccount = await getTestAccount();
    } catch (err) {
      console.log(err);
    }
  }, 15000);

  it('Can send verification mail', async () => {
    jest.setTimeout(20000);
    await expect(emailVerification.sendVerificationMail(testAccount.email))
      .resolves.not.toThrowError();
  }, 20000);

  afterAll(() => {
    closeMailTransporter();
  });
});
