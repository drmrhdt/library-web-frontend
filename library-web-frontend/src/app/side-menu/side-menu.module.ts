import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { ButtonModule } from '../shared/components/button/button.module'
import { ModalModule } from '../shared/components/modal/modal.module'

import { SideMenuComponent } from './side-menu/side-menu.component'

@NgModule({
    declarations: [SideMenuComponent],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        ModalModule
    ],
    exports: [SideMenuComponent]
})
export class SideMenuModule {}
