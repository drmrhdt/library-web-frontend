import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ButtonModule } from '../shared/components/button/button.module';

import { SideMenuComponent } from './side-menu/side-menu.component';

@NgModule({
  declarations: [SideMenuComponent],
  imports: [CommonModule, RouterModule, ButtonModule],
  exports: [SideMenuComponent],
})
export class SideMenuModule {}
