import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { MapComponent } from './map/map/map.component';
import { SidebarComponent } from './sidebar/sidebar/sidebar.component';
import { LoadDataComponent } from './sidebar/load-data/load-data.component';
import { PoiLayerComponent } from './map/poi-layer/poi-layer.component';
import { PoiDetailsComponent } from './sidebar/poi-details/poi-details.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    SidebarComponent,
    LoadDataComponent,
    PoiLayerComponent,
    PoiDetailsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (httpClient: HttpClient) => new TranslateHttpLoader(httpClient),
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
