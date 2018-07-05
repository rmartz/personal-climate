import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-router.module';
import { SetupPageComponent } from './setup-page/setup-page.component';
import { CoolingInfoComponent } from 'app/cooling-info/cooling-info.component';
import { ApiHttp } from './shared/services/api-http.service'
import { ClimateData } from './shared/services/climate-data.service';
import { CurrentCity } from './shared/services/current-city.service';
import { TokenConfigComponent } from './token-config/token-config.component';
import { CityConfigComponent } from './city-config/city-config.component';
import { ValidTokenGuard } from './core/guards/valid-token.service';
import { ConfiguredCityGuard } from './core/guards/configured-city.service';

@NgModule({
  declarations: [
    AppComponent,
    SetupPageComponent,
    TokenConfigComponent,
    CityConfigComponent,
    CoolingInfoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    AppRoutingModule
  ],
  providers: [
    ApiHttp,
    ValidTokenGuard,
    CurrentCity,
    ClimateData,
    ConfiguredCityGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
