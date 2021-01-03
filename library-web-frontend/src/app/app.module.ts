import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

import { SideMenuModule } from './side-menu/side-menu.module'
import { SearchModule } from './search/search.module'

import { HttpClientModule } from '@angular/common/http'
import { ApiModule } from './api/api.module'

declare module '@angular/core' {
    interface ModuleWithProviders<T = any> {
        ngModule: Type<T>
        providers?: Provider[]
    }
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        SideMenuModule,
        SearchModule,
        ApiModule,
        HttpClientModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
