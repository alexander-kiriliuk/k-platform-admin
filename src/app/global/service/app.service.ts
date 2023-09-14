import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Language} from "../../modules/locale/locale.types";
import {Category} from "../types";

@Injectable({providedIn: "root"})
export class AppService {

  private readonly http = inject(HttpClient);

  getOptions() {
    return this.http.get<{ langs: Language[] }>("/app/options");
  }

  getMenu() {
    return this.http.get<Category>("/app/menu");
  }

}
