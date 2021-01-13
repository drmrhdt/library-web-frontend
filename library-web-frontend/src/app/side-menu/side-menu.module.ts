import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

import { ButtonModule } from '../shared/components/button/button.module'
import { ModalModule } from '../shared/components/modal/modal.module'
import { BookFormModule } from '../book-form/book-form.module'
import { VaultFormModule } from '../vault-form/vault-form.module'

import { SideMenuComponent } from './side-menu.component'

@NgModule({
    declarations: [SideMenuComponent],
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        ModalModule,
        BookFormModule,
        VaultFormModule
    ],
    exports: [SideMenuComponent]
})
export class SideMenuModule {}
