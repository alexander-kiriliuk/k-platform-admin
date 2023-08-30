import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {JwtDto, LoginPayload} from "./auth.types";

@Injectable({providedIn: "root"})
export class AuthService {

  private readonly http = inject(HttpClient);

  login(payload: LoginPayload) {
    return this.http.post<JwtDto>("/auth/login", payload);
  }

  logout() {
    return this.http.post<void>("/auth/logout", null);
  }

}
