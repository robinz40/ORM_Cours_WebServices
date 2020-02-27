/* eslint-disable import/extensions */
import Model, { ModelConfig } from './model';

export interface UserSchema {
  id: number | string;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: { lat: number; lng: number };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export default class User extends Model implements UserSchema {
  name!: string;

  username!: string;

  email!: string;

  address!: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: number;
      lng: number;
    };
  };

  phone!: string;

  website!: string;

  company!: {
    name: string;
    catchPhrase: string;
    bs: string;
  };

  static config: ModelConfig = {
    endpoint: 'users',
  };

  constructor(userData: UserSchema) {
    super(userData.id);
    Object.assign(this, userData);
  }

  toString() {
    return JSON.stringify(this);
  }
}
