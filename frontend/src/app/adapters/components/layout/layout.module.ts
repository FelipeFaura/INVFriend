import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { LayoutComponent } from "./layout.component";
import { TranslatePipe } from "../../pipes/translate.pipe";

/**
 * Layout Module
 * Provides the main application layout with responsive sidebar navigation
 */
@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, RouterModule, TranslatePipe],
  exports: [LayoutComponent],
})
export class LayoutModule {}
