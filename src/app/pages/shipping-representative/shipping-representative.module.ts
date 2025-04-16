import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { ShippingRepresentativeListComponent } from "./shipping-representative-list/shipping-representative-list.component"
import { AddShippingRepresentativeComponent } from "./add-shipping-representative/add-shipping-representative.component"
const routes: Routes = [
  { path: "", component: ShippingRepresentativeListComponent },
  { path: "add", component: AddShippingRepresentativeComponent },
  { path: "", redirectTo: "add", pathMatch: "full" },

  { path: "edit/:id", component: AddShippingRepresentativeComponent },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShippingRepresentativeModule {}

