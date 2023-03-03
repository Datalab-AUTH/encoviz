import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { environment } from 'src/environments/environment';

import { TokenInterceptor } from '../interceptors/token.interceptor';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloak.issuer,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId
      },
      enableBearerInterceptor: false,
      bearerExcludedUrls: ['/assets'],
      loadUserProfileAtStartUp: true,
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: true,
        pkceMethod: 'S256'
      }
    });
}

@NgModule({
  imports: [KeycloakAngularModule],
  providers: [KeycloakService]
})
export class AuthModule {
  constructor(@Optional() @SkipSelf() parentModule: AuthModule) {
    if (parentModule) {
      throw new Error('AuthModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: initializeKeycloak,
          multi: true,
          deps: [KeycloakService]
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true
        }
      ]
    };
  }
}
