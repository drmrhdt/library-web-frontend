import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from '../shared/components/button/button.module';

import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [SearchComponent],
  imports: [CommonModule, ButtonModule],
  exports: [SearchComponent],
})
export class SearchModule {}
