import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {JwtDto, LoginPayload} from "./auth.types";

@Injectable()
export class AuthService {

  constructor(
    private readonly http: HttpClient) {
  }

  login(payload: LoginPayload) {
    return this.http.post<JwtDto>("/auth/login", payload);
  }

}
