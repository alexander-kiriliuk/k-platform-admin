import {ChangeDetectionStrategy, Component} from "@angular/core";
import {ProgressSpinnerModule} from "primeng/progressspinner";

@Component({
  selector: "preloader",
  templateUrl: "./preloader.component.html",
  styleUrls: ["./preloader.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ProgressSpinnerModule
  ]
})
export class PreloaderComponent {
}
