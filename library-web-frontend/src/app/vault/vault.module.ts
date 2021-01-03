import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'

import { ButtonModule } from '../shared/components/button/button.module'

import { VaultComponent } from './vault/vault.component'
import { VaultDetailsComponent } from './vault-details/vault-details.component'

const routes: Routes = [
    {
        path: '',
        component: VaultComponent,
        children: [{ path: ':id', component: VaultDetailsComponent }]
    }
]

@NgModule({
    declarations: [VaultComponent, VaultDetailsComponent],
    imports: [CommonModule, ButtonModule, RouterModule.forChild(routes)],
    exports: [VaultComponent]
})
export class VaultModule {}
