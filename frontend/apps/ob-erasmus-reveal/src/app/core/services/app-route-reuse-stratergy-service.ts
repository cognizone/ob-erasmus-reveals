import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, BaseRouteReuseStrategy, RouteReuseStrategy } from '@angular/router';

@Injectable()
export class AppRouteReuseStrategyService extends BaseRouteReuseStrategy implements RouteReuseStrategy {
  override shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    if (future.params['profileId'] !== curr.params['profileId']) return false;
    return super.shouldReuseRoute(future, curr);
  }
}
