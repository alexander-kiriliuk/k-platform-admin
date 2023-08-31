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

import {inject, Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {User} from "../types";
import {Store} from "../../modules/store/store";
import {CurrentUserEvent} from "../events";

@Injectable({providedIn: "root"})
export class CurrentUser {

  private readonly sub = new BehaviorSubject<User>(null);
  private readonly store = inject(Store);
  readonly asObservable = this.sub.asObservable();

  constructor() {
    this.store.on<User>(CurrentUserEvent.Set)
      .subscribe(v => this.setUser(v.payload));
    this.store.on<User>(CurrentUserEvent.Update)
      .subscribe(v => this.updateUser(v.payload));
  }

  get fullName() {
    const usr = this.sub.value; // todo detect lang, write pipe? fullName?
    return `${usr.firstName[0].value} ${usr.lastName[0].value}`;
  }

  private setUser(user: User) {
    this.sub.next(user);
  }

  private updateUser(updatedUser: Partial<User>) {
    const currentUser = this.sub.value;
    if (currentUser) {
      const newUser = {...currentUser, ...updatedUser};
      this.sub.next(newUser);
    }
  }

}
