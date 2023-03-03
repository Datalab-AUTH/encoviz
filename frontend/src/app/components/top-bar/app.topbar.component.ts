import { Component, OnInit } from '@angular/core';

import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { MenuItem } from 'primeng/api';
import { AppMainComponent } from 'src/app/app.main.component';
import { ConfigService } from 'src/app/services/app.config.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {
  scales: number[] = [12, 13, 14, 15, 16];
  items: MenuItem[];
  toggleUserMenu: boolean;
  userProfile: KeycloakProfile;
  toggleNotification: boolean;

  get scale(): number {
    return this.configService.config.scale;
  }

  set scale(_val: number) {
    this.configService.config.scale = _val;
  }

  constructor(
    public appMain: AppMainComponent,
    private readonly authService: KeycloakService,
    private readonly configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.authService.loadUserProfile().then((res) => {
      this.userProfile = res;
    });
  }

  openUserMenu(event: MouseEvent) {
    this.toggleUserMenu = !this.toggleUserMenu;
    event.preventDefault();
  }

  toggleNotificationMenu(event: MouseEvent) {
    this.toggleNotification = !this.toggleNotification;
    event.preventDefault();
  }

  decrementScale() {
    this.scale--;
    this.applyScale();
  }

  incrementScale() {
    this.scale++;
    this.applyScale();
  }

  applyScale() {
    document.documentElement.style.fontSize = this.scale + 'px';
  }

  accountManagement() {
    this.authService.getKeycloakInstance().accountManagement();
  }

  logout(event: MouseEvent) {
    this.authService.logout(window.location.origin);
    event.preventDefault();
  }
}
