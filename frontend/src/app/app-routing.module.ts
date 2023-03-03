import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppMainComponent } from './app.main.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: AppMainComponent,
          children: [
            {
              path: '',
              loadChildren: () =>
                import('./module-handler/module-handler.module').then((mod) => mod.ModuleHandlerModule)
            }
          ]
        },
        { path: 'not-found', component: NotfoundComponent },
        { path: '**', redirectTo: 'not-found' }
      ],
      { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
