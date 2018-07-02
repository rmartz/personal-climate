import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-router.module';
import { SetupPageComponent } from './setup-page/setup-page.component';
import { ApiHttp } from './shared/services/api-http.service'

@NgModule({
  declarations: [
    AppComponent,
    SetupPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    AppRoutingModule
  ],
  providers: [ApiHttp],
  bootstrap: [AppComponent]
})
export class AppModule { }
