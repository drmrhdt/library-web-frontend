import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'

import { AngularFireModule } from '@angular/fire'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

import { SideMenuModule } from './side-menu/side-menu.module'
import { SearchModule } from './search/search.module'

import { ApiModule } from './api/api.module'

import { environment } from 'src/environments/environment'

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
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebaseConfig, 'cloud')
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
