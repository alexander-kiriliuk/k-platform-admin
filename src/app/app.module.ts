/*
 * Copyright 2023 Alexander Kiriliuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {APP_INITIALIZER, isDevMode, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {StoreModule} from "./modules/store/store.module";
import {WEBP_SUPPORT} from "./modules/media/media.constants";
import {MediaUtils} from "./modules/media/media.utils";
import {DeviceDetectorService} from "ngx-device-detector";
import {DEVICE} from "./modules/device/device.constants";
import {DeviceInfoImpl} from "./modules/device/device-info.impl";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppInterceptor} from "./global/interceptor/app.interceptor";
import {provideTransloco} from "@ngneat/transloco";
import {TranslocoHttpLoader} from "./global/internationalization/transloco-http-loader";
import {LangUtils} from "./global/util/lang.utils";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {CurrentUser} from "./global/service/current-user";
import {AppInitializer} from "./global/service/app-initializer";
import {LocalizePipe} from "./modules/locale/localize.pipe";
import detectWebpSupportFactory = MediaUtils.detectWebpSupportFactory;

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ProgressSpinnerModule,
    StoreModule.forRoot(),
    ToastModule
  ],
  providers: [
    LocalizePipe,
    MessageService,
    {
      provide: APP_INITIALIZER,
      useFactory: AppInitializer,
      multi: true,
      deps: [CurrentUser]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    },
    {
      provide: WEBP_SUPPORT,
      useFactory: detectWebpSupportFactory,
      deps: [
        DeviceDetectorService
      ]
    },
    {
      provide: DEVICE,
      useClass: DeviceInfoImpl,
      deps: [DeviceDetectorService]
    },
    provideTransloco({
      config: {
        availableLangs: LangUtils.AvailableLangs,
        defaultLang: LangUtils.DefaultLang,
        reRenderOnLangChange: true,
        prodMode: !isDevMode()
      },
      loader: TranslocoHttpLoader
    })
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
