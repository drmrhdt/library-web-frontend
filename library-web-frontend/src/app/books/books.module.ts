import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BooksComponent } from './books.component';

const routes: Routes = [
  {
    path: '',
    component: BooksComponent,
    children: [{ path: ':type', component: BooksComponent }],
  },
];

@NgModule({
  declarations: [BooksComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [BooksComponent],
})
export class BooksModule {}
