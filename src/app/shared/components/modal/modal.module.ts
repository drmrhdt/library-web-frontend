import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { ButtonModule } from '../button/button.module'

import { ModalComponent } from './modal.component'

@NgModule({
    declarations: [ModalComponent],
    imports: [CommonModule, ButtonModule],
    exports: [ModalComponent]
})
export class ModalModule {}
