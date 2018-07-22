import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-router.module';
import { CoolingInfoComponent } from './cooling-info/cooling-info.component';
import { HotDaysComponent } from './hot-days/hot-days.component';
import { InfoPageComponent } from './info-page/info-page.component';
import { ApiHttp } from './shared/services/api-http.service';
import { ClimateData } from './shared/services/climate-data.service';
import { CityData } from './shared/services/city-data.service';
import { CurrentCity } from './shared/services/current-city.service';
import { TokenConfigComponent } from './token-config/token-config.component';
import { CityConfigComponent } from './city-config/city-config.component';
import { ValidTokenGuard } from './core/guards/valid-token.service';
import { ConfiguredCityGuard } from './core/guards/configured-city.service';
import { AverageTempComponent } from './average-temp/average-temp.component';
import { IndicatorBlockComponent } from './indicator-block/indicator-block.component';
import { KebabCasePipe } from './shared/pipes/kebab-case.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TokenConfigComponent,
    CityConfigComponent,
    CoolingInfoComponent,
    HotDaysComponent,
    AverageTempComponent,
    InfoPageComponent,
    IndicatorBlockComponent,
    KebabCasePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule
  ],
  providers: [
    ApiHttp,
    ValidTokenGuard,
    CurrentCity,
    ClimateData,
    CityData,
    ConfiguredCityGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
