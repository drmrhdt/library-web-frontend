import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule, Routes } from '@angular/router'

import { ModalModule } from '../shared/components/modal/modal.module'
import { BookFormModule } from '../book-form/book-form.module'

import { BooksComponent } from './books.component'
import { BookDetailsComponent } from './book-details/book-details.component'

const routes: Routes = [
    {
        path: '',
        component: BooksComponent
    },
    { path: ':id', component: BookDetailsComponent }
]

@NgModule({
    declarations: [BooksComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        BookFormModule,
        ModalModule,
        RouterModule.forChild(routes)
    ],
    exports: [BooksComponent]
})
export class BooksModule {}
