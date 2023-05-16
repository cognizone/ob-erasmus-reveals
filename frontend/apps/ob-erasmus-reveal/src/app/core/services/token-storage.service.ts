import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  set tokenParams(value: Params) {
    const item = {
      value: value,
      expiry: new Date().getTime() + 600000, //(For first round of testing)  //2592000000, // 30 days in milliseconds, making sure this expires after 30 days
    };
    localStorage.setItem('token', JSON.stringify(item));
  }

  get tokenParams(): Params {
    const value = localStorage.getItem('token');
    return value ? JSON.parse(value) : '';
  }
}
