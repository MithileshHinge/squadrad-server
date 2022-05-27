/* eslint-disable import/prefer-default-export */
import { paymentsData } from '../database';
import AddPayment from './AddPayment';
import FindPayment from './FindPayment';

export const addPayment = new AddPayment(paymentsData);
export const findPayment = new FindPayment(paymentsData);
