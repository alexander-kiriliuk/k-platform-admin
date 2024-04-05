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

import {environment} from "@global/env/env";
import {APP_INITIALIZER, enableProdMode, isDevMode, LOCALE_ID} from "@angular/core";
import {ThemeUtils} from "@global/util/theme.utils";
import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {provideRouter} from "@angular/router";
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideTransloco, provideTranslocoLoader} from "@ngneat/transloco";
import {TranslocoHttpLoader} from "@global/internationalization/transloco-http-loader";
import {Store} from "@modules/store/store";
import {AppInitializer} from "@global/service/app-initializer";
import {MessageService, PrimeNGConfig} from "primeng/api";
import {CurrentUser} from "@global/service/current-user";
import {AppInterceptor} from "@global/interceptor/app.interceptor";
import {WEBP_SUPPORT} from "@modules/media/media.constants";
import {DeviceDetectorService} from "ngx-device-detector";
import {DEVICE} from "@modules/device/device.constants";
import {DeviceInfoImpl} from "@modules/device/device-info.impl";
import {MediaUtils} from "@modules/media/media.utils";
import {LocalizePipe} from "@modules/locale/localize.pipe";
import {DialogService} from "primeng/dynamicdialog";
import {APP_ROUTES} from "./app/app.routing";
import {AVAIL_LANGS} from "@modules/locale/locale.constants";
import {
provideExplorerSectionRenderers
} from "@components/explorer/explorer-secrion-renderer-providers";
import {
provideExplorerObjectRenderers
} from "@components/explorer/explorer-object-renderer-providers";
import {
provideExplorerActionRenderers
} from "@components/explorer/explorer-action-renderer-providers";
import detectWebpSupportFactory = MediaUtils.detectWebpSupportFactory;
import setNgTranslation = LangUtils.setNgTranslation;
import {LangUtils} from "@global/util/lang.utils";

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
