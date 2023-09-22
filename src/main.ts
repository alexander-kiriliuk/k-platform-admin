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

import {environment} from "./app/global/env/env";
import {APP_INITIALIZER, enableProdMode, isDevMode} from "@angular/core";
import {ThemeUtils} from "./app/global/util/theme.utils";
import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {provideRouter} from "@angular/router";
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideTransloco} from "@ngneat/transloco";
import {LangUtils} from "./app/global/util/lang.utils";
import {TranslocoHttpLoader} from "./app/global/internationalization/transloco-http-loader";
import {Store} from "./app/modules/store/store";
import {AppInitializer} from "./app/global/service/app-initializer";
import {MessageService, PrimeNGConfig} from "primeng/api";
import {CurrentUser} from "./app/global/service/current-user";
import {AppInterceptor} from "./app/global/interceptor/app.interceptor";
import {WEBP_SUPPORT} from "./app/modules/media/media.constants";
import {DeviceDetectorService} from "ngx-device-detector";
import {DEVICE} from "./app/modules/device/device.constants";
import {DeviceInfoImpl} from "./app/modules/device/device-info.impl";
import {MediaUtils} from "./app/modules/media/media.utils";
import {LocalizePipe} from "./app/modules/locale/localize.pipe";
import {DialogService} from "primeng/dynamicdialog";
import detectWebpSupportFactory = MediaUtils.detectWebpSupportFactory;

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
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    provideAnimations(),
    provideRouter([
      {
        path: "auth",
        loadComponent: () => import("./app/auth/auth.component")
          .then(m => m.AuthComponent)
      },
      {
        path: "",
        loadChildren: () => import("./app/dashboard/dashboard.routes")
          .then(m => m.DashboardRoutes)
      },
    ]),
    provideTransloco({
      config: {
        defaultLang: LangUtils.DefaultLang,
        reRenderOnLangChange: true,
        prodMode: !isDevMode()
      },
      loader: TranslocoHttpLoader
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: AppInitializer,
      multi: true,
      deps: [PrimeNGConfig, CurrentUser]
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
  ]
}).catch(err => console.error(err));
