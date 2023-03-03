import { Component, OnInit } from '@angular/core';

import { KeycloakService } from 'keycloak-angular';
import { MenuItem } from 'primeng/api';

import { AppMainComponent } from './app.main.component';
import { Roles } from './auth/auth.roles';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {
  model: MenuItem[];

  constructor(public appMain: AppMainComponent, private authService: KeycloakService) {}

  ngOnInit() {
    this.model = [
      {
        label: 'Favorites',
        items: [
          {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/']
          },
          {
            label: this.authService.isUserInRole(Roles.Customer)
              ? 'My Electrical Devices'
              : 'Electrical Devices management',
            icon: 'pi pi-fw pi-th-large',
            routerLink: ['devices'],
            visible: [Roles.Customer, Roles.Provider].some((role) => this.authService.isUserInRole(role))
          }
        ]
      }
    ];
  }

  onKeydown(event: KeyboardEvent) {
    const nodeElement = <HTMLDivElement>event.target;
    if (event.code === 'Enter' || event.code === 'Space') {
      nodeElement.click();
      event.preventDefault();
    }
  }
}
