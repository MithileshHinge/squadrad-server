import nodemailer from 'nodemailer';

export default async function getTestAccount() {
  const account = await nodemailer.createTestAccount();
  return {
    email: account.user,
    password: account.pass,
  };
}
