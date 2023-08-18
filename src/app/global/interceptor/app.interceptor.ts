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

import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";
import {environment} from "../env/env";

@Injectable()
export class AppInterceptor implements HttpInterceptor {

	constructor(
    private readonly router: Router) {
	}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		request = request.clone({
			withCredentials: true,
			url: this.normalizeUrl(request.url)
		});
		return next.handle(request).pipe(
			// todo add tokens to req
			catchError((error: HttpErrorResponse) => {
				if (error.status === 404) {
					this.router.navigate(["/404"], {skipLocationChange: true});
				}
				if (error.status >= 500) {
					this.router.navigate(["/500"]);
				}
				return throwError(() => error);
			})
		);
	}

	private normalizeUrl(url: string) {
		const segments = url.split("/");
		const lastSegment = segments[segments.length - 1];
		if (url.indexOf("//") !== -1 || lastSegment.indexOf(".") !== -1) {
			return encodeURI(url);
		}
		url = `${environment.apiUrl}${url}`;
		return encodeURI(url);
	}

}
