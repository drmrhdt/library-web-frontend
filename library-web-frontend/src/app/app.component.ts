import { Component } from '@angular/core'

import { AppService } from './services/app.service'
import { vaults } from '../assets/mock/vaults'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    vaults = vaults

    constructor(private _appService: AppService) {
        this._appService.vaults$.next(vaults)
    }
}
