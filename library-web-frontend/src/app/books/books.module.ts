import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'

import { ButtonModule } from '../shared/components/button/button.module'

import { BooksComponent } from './books.component'

const routes: Routes = [
    {
        path: '',
        component: BooksComponent,
        children: [
            {
                path: ':type',
                component: BooksComponent
                //here we need resolver to filter data before page loaded
            }
        ]
    }
]

@NgModule({
    declarations: [BooksComponent],
    imports: [CommonModule, ButtonModule, RouterModule.forChild(routes)],
    exports: [BooksComponent]
})
export class BooksModule {}
