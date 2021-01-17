import { Component } from '@angular/core'

import { BookService, VaultService, TagsService } from './api/index'

import { AppService } from './services/app.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(
        private _appService: AppService,
        private _bookService: BookService,
        private _vaultService: VaultService,
        private _tagsService: TagsService
    ) {
        this._bookService
            .bookControllerGetAll()
            .subscribe(books => this._appService.books$.next(books))

        this._vaultService
            .vaultControllerGetAll()
            .subscribe(vaults => this._appService.vaults$.next(vaults))

        this._tagsService
            .tagsControllerFindAll()
            .subscribe(tags => this._appService.tags$.next(tags))
    }
}
