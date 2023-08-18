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

import {Component, Inject, OnInit} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {ProfileService} from "./modules/profile/profile.service";
import {finalize, throwError} from "rxjs";
import {Router} from "@angular/router";
import {catchError} from "rxjs/operators";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {

	constructor(
    @Inject(DOCUMENT) private readonly doc: Document,
    private readonly router: Router,
    private readonly profileService: ProfileService) {
	}

	ngOnInit(): void {
		this.profileService.currentUser().pipe(
			finalize(() => {
				this.doc.body.classList.remove("pending");
			}),
			catchError((error) => {
				this.router.navigate(["/auth"]);
				return throwError(() => error);
			})
		).subscribe(v => {
			console.log(v);
		});
	}

}

