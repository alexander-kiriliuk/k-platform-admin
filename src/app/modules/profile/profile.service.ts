import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../../global/types";

@Injectable({providedIn: "root"})
export class ProfileService {

	constructor(
    private readonly http: HttpClient) {
	}

	currentUser() {
		return this.http.get<User>("/profile");
	}

}
