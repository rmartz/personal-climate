import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SetupPageComponent } from './setup-page/setup-page.component';
import { InfoPageComponent } from './info-page/info-page.component';
import { ValidTokenGuard } from './core/guards/valid-token.service';
import { ConfiguredCityGuard } from './core/guards/configured-city.service';

const routes: Routes = [
  { path: 'settings',
    component: SetupPageComponent
  },
  { path: '',
    component: InfoPageComponent,
    canActivate: [ValidTokenGuard, ConfiguredCityGuard],
  },
  { path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
