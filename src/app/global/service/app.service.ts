import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Language} from "../../modules/locale/locale.types";

@Injectable({providedIn: "root"})
export class AppService {

  private readonly http = inject(HttpClient);

  options() {
    return this.http.get<{ langs: Language[] }>("/app/options");
  }

}
