import { randomUUID } from 'node:crypto';

export interface User {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
  postalCode: string;
  houseNumber: string; 
  street: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  password: string;
}

export interface CheckoutData {
  address: {
    country: string;
    postalCode: string;
    houseNumber: string;
    street: string;
    city: string;
    state: string;
  };
  bank: {
    name: string;
    accountName: string;
    accountNumber: string;
  };
}

export const seededCustomer: Pick<User, 'email' | 'password'> = {
  email: process.env.TEST_USER_EMAIL ?? '',
  password: process.env.TEST_USER_PASSWORD ?? '',
};

export function createUser(): User {
  const uniqueSuffix = `${Date.now()}.${randomUUID()}`;

  return {
    firstName: 'Test',
    lastName: 'Customer',
    dateOfBirth: '1990-01-01',
    country: 'CA',
    postalCode: 'M5V 2T6',
    houseNumber: '42',
    street: 'Test Street',
    city: 'Toronto',
    state: 'Ontario',
    phone: '5551234567',
    email: `sis2.${uniqueSuffix}@example.com`,
    password: `TestUser!${Date.now().toString().slice(-6)}${randomUUID().slice(0, 4)}`,
  };
}

export function createCheckoutData(): CheckoutData {
  return {
    address: {
      country: 'CA',
      postalCode: 'M5V 2T6',
      houseNumber: '42',
      street: 'Test Street',
      city: 'Toronto',
      state: 'Ontario',
    },
    bank: {
      name: 'Example Bank',
      accountName: 'Test Customer',
      accountNumber: '12345678901234',
    },
  };
}
