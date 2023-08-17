import {Component, Inject} from "@angular/core";
import {DOCUMENT} from "@angular/common";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"]
})
export class AppComponent {

	constructor(
    @Inject(DOCUMENT) private readonly doc: Document) {
		this.doc.body.classList.remove("pending");
	}

}

