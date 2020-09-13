import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { VaultComponent } from './vault/vault.component';
import { VaultDetailsComponent } from './vault-details/vault-details.component';

const routes: Routes = [
  {
    path: '',
    component: VaultComponent,
    children: [{ path: ':id', component: VaultDetailsComponent }],
  },
];

@NgModule({
  declarations: [VaultComponent, VaultDetailsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [VaultComponent],
})
export class VaultModule {}
