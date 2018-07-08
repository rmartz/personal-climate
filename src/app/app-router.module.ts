import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InfoPageComponent } from './info-page/info-page.component';

const routes: Routes = [
  { path: '',
    component: InfoPageComponent
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
