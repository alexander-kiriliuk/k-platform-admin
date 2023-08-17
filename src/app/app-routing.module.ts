import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
	{
		path: "auth",
		loadComponent: () => import("./auth/auth.component").then(m => m.AuthComponent)
	},
	{
		path: "dashboard",
		loadChildren: () => import("./dashboard/dashboard.module").then(m => m.DashboardModule)
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {
}
