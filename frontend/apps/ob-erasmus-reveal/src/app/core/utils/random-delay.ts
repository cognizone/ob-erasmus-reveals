import { map, Observable } from 'rxjs';
import { timer } from 'rxjs';

export function randomDelay<T>(value: T, minMs: number = 50, maxMs: number = 300): Observable<T> {
  return timer(getRandomInt(minMs, maxMs)).pipe(map(() => value));
}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
