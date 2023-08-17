import {LoginForm} from "./auth.types";
import {FormControl, FormGroup, Validators} from "@angular/forms";

export function createLoginForm(): FormGroup<LoginForm> {
	return new FormGroup<LoginForm>({
		login: new FormControl<string>("", [Validators.required]),
		password: new FormControl<string>("", [Validators.required])
	});
}
