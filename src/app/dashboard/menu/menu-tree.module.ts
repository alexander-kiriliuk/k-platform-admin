import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MenuTreeComponent} from "./menu-tree.component";
import {StopPropagationModule} from "../../modules/events/stop-propagation/stop-propagation.module";

@NgModule({
  imports: [
    CommonModule,
    StopPropagationModule,
  ],
  exports: [
    MenuTreeComponent
  ],
  declarations: [MenuTreeComponent]
})
export class MenuTreeModule {
}
