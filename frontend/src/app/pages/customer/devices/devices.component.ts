import { Component } from '@angular/core';

import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import { Device } from 'src/app/api/appconfig.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})
export class DevicesComponent {
  devices$: Observable<Device[]> = this.userService.getUsersDevices(
    this.keycloakService.getKeycloakInstance().profile.id
  );
  cols = [
    { field: 'id', header: 'Unique Identifier', isSortable: true },
    { field: 'name', header: 'Name', isSortable: true }
  ];

  constructor(private userService: UserService, private keycloakService: KeycloakService) {}
}
