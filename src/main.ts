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

import {APP_INITIALIZER, enableProdMode, isDevMode, LOCALE_ID} from "@angular/core";
import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {provideRouter} from "@angular/router";
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideTransloco, provideTranslocoLoader} from "@ngneat/transloco";
import {MessageService, PrimeNGConfig} from "primeng/api";
import {DeviceDetectorService} from "ngx-device-detector";
import {DialogService} from "primeng/dynamicdialog";
import {APP_ROUTES} from "./app/app.routing";
import {
AppInitializer,
AppInterceptor,
AVAIL_LANGS,
CurrentUser,
DEVICE,
DeviceInfoImpl,
LangUtils,
LocalizePipe,
MediaUtils,
provideExplorerActionRenderers,
provideExplorerObjectRenderers,
provideExplorerSectionRenderers,
Store,
ThemeUtils,
TranslocoHttpLoader,
WEBP_SUPPORT
} from "@k-platform/client-core";
import detectWebpSupportFactory = MediaUtils.detectWebpSupportFactory;
import setNgTranslation = LangUtils.setNgTranslation;
import {environment} from "./app/env/env";


ThemeUtils.setDefaultTheme();

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    Store,
    LocalizePipe,
    MessageService,
    DialogService,
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideRouter(APP_ROUTES),
    provideTranslocoLoader(TranslocoHttpLoader),
    provideExplorerSectionRenderers(),
    provideExplorerObjectRenderers(),
    provideExplorerActionRenderers(),
    provideTransloco({
      config: {
        defaultLang: LangUtils.DefaultLang,
        prodMode: !isDevMode()
      },
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: AppInitializer,
      multi: true,
      deps: [PrimeNGConfig, CurrentUser]
    },
    {
      provide: LOCALE_ID,
      useFactory: () => {
        const lang = LangUtils.getCurrentLang();
        switch (lang) {
          case "ru":
            import("@angular/common/locales/ru").then(setNgTranslation);
            break;
          case "en":
            import("@angular/common/locales/en").then(setNgTranslation);
            break;
        }
        return navigator.language;
      },
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
      provide: AVAIL_LANGS,
      useFactory: LangUtils.getAvailableLangs
    },
    {
      provide: DEVICE,
      useClass: DeviceInfoImpl,
      deps: [DeviceDetectorService]
    },
  ]
}).catch(err => console.error(err));
