import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { KeycloakService } from 'keycloak-angular';
import { combineLatest, from, map, mergeMap, Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private keycloak: KeycloakService) {}

  private async conditionallyUpdateToken(req: HttpRequest<unknown>): Promise<boolean> {
    if (this.keycloak.shouldUpdateToken(req)) {
      return await this.keycloak.updateToken();
    }

    return true;
  }

  public intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const { excludedUrls } = this.keycloak;

    const shallPass: boolean = excludedUrls.findIndex((item) => item.urlPattern.test(req.url)) > -1;
    if (shallPass) {
      return next.handle(req);
    }

    return combineLatest([this.conditionallyUpdateToken(req), this.keycloak.isLoggedIn()]).pipe(
      mergeMap(([_, isLoggedIn]) => (isLoggedIn ? this.handleRequestWithTokenHeader(req, next) : next.handle(req)))
    );
  }

  private handleRequestWithTokenHeader(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.addTokenToHeader(req.headers).pipe(
      mergeMap((headersWithToken) => {
        const kcReq = req.clone({ headers: headersWithToken });
        return next.handle(kcReq);
      })
    );
  }

  private addTokenToHeader(headers?: HttpHeaders): Observable<HttpHeaders> {
    return from(this.keycloak.getToken()).pipe(map((token) => (token ? headers.set('Access-Token', token) : headers)));
  }
}
