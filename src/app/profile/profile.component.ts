import {ChangeDetectionStrategy, Component, inject, OnInit} from "@angular/core";
import {CurrentUser} from "../global/service/current-user";
import {ButtonModule} from "primeng/button";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {TranslocoPipe} from "@ngneat/transloco";
import {InputTextModule} from "primeng/inputtext";
import {CreateProfileForm} from "./profile.constants";
import {ReactiveFormsModule} from "@angular/forms";
import {PasswordModule} from "primeng/password";
import {MediaComponent} from "../modules/media/media.component";
import {InputSwitchModule} from "primeng/inputswitch";
import {CheckboxModule} from "primeng/checkbox";
import {ProfileService} from "./profile.service";
import {User} from "../global/types";

@Component({
  selector: "profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ButtonModule,
    TranslocoPipe,
    InputTextModule,
    ReactiveFormsModule,
    PasswordModule,
    MediaComponent,
    InputSwitchModule,
    CheckboxModule,
  ]
})
export class ProfileComponent implements OnInit {

  readonly currentUser = inject(CurrentUser);
  readonly form = CreateProfileForm();
  private readonly ref = inject(DynamicDialogRef);
  private readonly profileService = inject(ProfileService);

  ngOnInit(): void {
    this.form.patchValue(this.currentUser.data);
  }

  save() {
    // TODO add animation
    this.profileService.updateUser(this.form.value as User).subscribe(v => {
      this.ref.close();
    });
  }

}
