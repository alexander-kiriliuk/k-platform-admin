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

@Component({
	selector: "auth",
	standalone: true,
	templateUrl: "./auth.component.html",
	styleUrls: ["./auth.component.scss"],
	imports: [CommonModule, InputTextModule, PasswordModule, ButtonModule, RippleModule, CardModule, ImageModule, ReactiveFormsModule],
})
export class AuthComponent {

	readonly form = createLoginForm();

}

