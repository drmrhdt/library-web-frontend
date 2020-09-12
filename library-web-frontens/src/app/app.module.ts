import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SideMenuModule } from './side-menu/side-menu.module';
import { SearchModule } from './search/search.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, SideMenuModule, SearchModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
