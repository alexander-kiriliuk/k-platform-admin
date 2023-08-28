import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PreventDefaultDirective} from "./prevent-default.directive";

@NgModule({
  imports: [CommonModule],
  declarations: [PreventDefaultDirective],
  exports: [PreventDefaultDirective]
})
export class PreventDefaultModule {
}
