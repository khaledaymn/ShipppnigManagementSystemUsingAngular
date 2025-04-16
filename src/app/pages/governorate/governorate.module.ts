import { RouterModule, Routes } from "@angular/router";
import { GovernorateListComponent } from "./governorate-list/governorate-list.component";
import { GovernorateFormComponent } from "./governorate-form/governorate-form.component";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";


const routes: Routes = [
  { path: "", component: GovernorateListComponent },
  { path: "add", component: GovernorateFormComponent },
  { path: "edit/:id", component: GovernorateFormComponent },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    GovernorateListComponent,
    GovernorateFormComponent
  ],
})

export class GovernorateModule {}
