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

import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {CardModule} from "primeng/card";
import {ImageModule} from "primeng/image";
import {createLoginForm} from "./auth.constants";
import {ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Store} from "../modules/store/store";
import {AuthEvent} from "./auth.event";

@Component({
  selector: "auth",
  standalone: true,
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
  imports: [
    CommonModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RippleModule,
    CardModule,
    ImageModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService
  ]
})
export class AuthComponent {

  readonly form = createLoginForm();

  constructor(
    private readonly store: Store,
    private readonly authService: AuthService) {
  }

  onSubmit() {
    const data = this.form.value;
    this.authService.login({
      login: data.login,
      password: data.password
    }).subscribe(v => {
      this.store.emit(AuthEvent.Success, v);
    });
  }

}

