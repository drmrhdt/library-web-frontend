import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { ButtonModule } from '../shared/components/button/button.module'
import { VaultFormComponent } from './vault-form.component'

@NgModule({
    declarations: [VaultFormComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule],
    exports: [VaultFormComponent]
})
export class VaultFormModule {}
