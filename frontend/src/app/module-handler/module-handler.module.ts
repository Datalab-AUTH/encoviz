import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, ROUTES } from '@angular/router';

import { KeycloakService } from 'keycloak-angular';

import { Roles } from '../auth/auth.roles';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule],
  providers: [
    {
      provide: ROUTES,
      useFactory: configRoutesPerUser,
      deps: [KeycloakService],
      multi: true
    }
  ]
})
export class ModuleHandlerModule {}

export function configRoutesPerUser(keycloakService: KeycloakService) {
  let routes: Routes = [];
  if (keycloakService.isLoggedIn()) {
    if (keycloakService.getUserRoles().includes(Roles.Admin)) {
      routes = [
        {
          path: '',
          loadChildren: () => import('../pages/admin/admin.module').then((mod) => mod.AdminModule)
        }
      ];
    } else if (keycloakService.getUserRoles().includes(Roles.Customer)) {
      routes = [
        {
          path: '',
          loadChildren: () => import('../pages/customer/customer.module').then((mod) => mod.CustomerModule)
        }
      ];
    } else if (keycloakService.getUserRoles().includes(Roles.Provider)) {
      routes = [
        {
          path: '',
          loadChildren: () => import('../pages/provider/provider.module').then((mod) => mod.ProviderModule)
        }
      ];
    }
  }
  return routes;
}
