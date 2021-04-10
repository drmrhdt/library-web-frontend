import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'

import { ButtonModule } from '../shared/components/button/button.module'

import { BookFormComponent } from './book-form.component'

@NgModule({
    declarations: [BookFormComponent],
    imports: [CommonModule, ReactiveFormsModule, ButtonModule],
    exports: [BookFormComponent]
})
export class BookFormModule {}
