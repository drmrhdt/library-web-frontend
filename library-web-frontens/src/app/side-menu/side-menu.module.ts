import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { SideMenuComponent } from './side-menu/side-menu.component';

@NgModule({
  declarations: [SideMenuComponent],
  imports: [CommonModule, RouterModule, SharedModule],
  exports: [SideMenuComponent],
})
export class SideMenuModule {}
