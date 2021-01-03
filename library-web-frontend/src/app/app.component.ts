import { Component } from '@angular/core'

import { AppService } from './services/app.service'
import { BookService } from './api/api/book.service'
import { VaultService } from './api/api/vault.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(
        private _appService: AppService,
        private _bookService: BookService,
        private _vaultService: VaultService
    ) {
        this._bookService
            .bookControllerGetAll()
            .subscribe(books => this._appService.books$.next(books))

        this._vaultService
            .vaultControllerGetAll()
            .subscribe(vaults => this._appService.vaults$.next(vaults))
    }
}
