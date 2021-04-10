import { Component, OnDestroy, OnInit } from '@angular/core'

import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { BookService, VaultService, TagsService } from './api/index'

import { AppService } from './services/app.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    private _unsubscriber$ = new Subject()

    constructor(
        private _appService: AppService,
        private _bookService: BookService,
        private _vaultService: VaultService,
        private _tagsService: TagsService
    ) {}

    ngOnInit(): void {
        this._bookService
            .bookControllerGetAll()
            .pipe(takeUntil(this._unsubscriber$))
            .subscribe(books => this._appService.books$.next(books))

        this._vaultService
            .vaultControllerGetAll()
            .pipe(takeUntil(this._unsubscriber$))
            .subscribe(vaults => this._appService.vaults$.next(vaults))

        this._tagsService
            .tagsControllerFindAll()
            .pipe(takeUntil(this._unsubscriber$))
            .subscribe(tags => this._appService.tags$.next(tags))
    }

    ngOnDestroy(): void {
        this._unsubscriber$.next()
        this._unsubscriber$.complete()
    }
}
