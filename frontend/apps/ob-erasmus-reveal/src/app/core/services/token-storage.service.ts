import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  set tokenParams(value: Params) {
    sessionStorage.setItem('token', JSON.stringify(value));
  }

  get tokenParams(): Params {
    const value = sessionStorage.getItem('token');
    return value ? JSON.parse(value) : '';
  }
}
