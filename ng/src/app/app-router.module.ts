import { Injectable, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SetupPageComponent } from './setup-page/setup-page.component';

const routes: Routes = [
  { path: '**', component: SetupPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
