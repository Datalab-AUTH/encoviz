import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppFooterComponent } from './app.footer.component';
import { AppMainComponent } from './app.main.component';
import { AppMenuComponent } from './app.menu.component';
import { AppMenuitemComponent } from './app.menuitem.component';
import { AuthModule } from './auth/auth.module';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AppTopBarComponent } from './components/top-bar/app.topbar.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AuthModule.forRoot(),
    AvatarModule,
    ButtonModule
  ],
  declarations: [
    AppComponent,
    AppMainComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    NotfoundComponent
  ],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule {}
