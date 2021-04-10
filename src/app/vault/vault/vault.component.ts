import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'

import { Subject } from 'rxjs'
import { filter, map, mergeMap, takeUntil } from 'rxjs/operators'

import { BookService, VaultService } from '../../api/index'

import { AppService } from '../../services/app.service'

@Component({
    selector: 'app-vault',
    templateUrl: './vault.component.html',
    styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements OnInit, OnDestroy {
    vaults = []
    filteredVaults = []
    isDeletingDialogOpened = false
    isUpdatingDialogOpened = false
    vault

    private _unsubscriber$ = new Subject()

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _appService: AppService,
        private _bookService: BookService,
        private _vaultService: VaultService
    ) {}

    ngOnInit(): void {
        this._appService.vaults$
            .pipe(takeUntil(this._unsubscriber$))
            .subscribe(vaults => {
                this.vaults = vaults
                this.filteredVaults = vaults

                const id = +this._route.snapshot.firstChild?.params.id
                this.filteredVaults = id
                    ? this.vaults?.filter(vault => vault.id === id)
                    : this.vaults
            })

        this._router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => this._route),
                map(route => {
                    while (route.firstChild) route = route.firstChild
                    return route
                }),
                filter(route => route.outlet === 'primary'),
                mergeMap(route => route.params)
            )
            .pipe(takeUntil(this._unsubscriber$))
            .subscribe(params => {
                const id = +params['id']
                this.filteredVaults = id
                    ? this.vaults?.filter(vault => vault.id === id)
                    : this.vaults
            })
    }

    ngOnDestroy(): void {
        this._unsubscriber$.next()
        this._unsubscriber$.complete()
    }

    deleteVault(): void {
        this._vaultService
            .vaultControllerDeleteById(this.vault?.id)
            .pipe(
                mergeMap(() => this._bookService.bookControllerGetAll()),
                mergeMap(res => {
                    this._appService.books$.next(res)
                    return this._vaultService.vaultControllerGetAll()
                })
            )
            .pipe(takeUntil(this._unsubscriber$))
            .subscribe(res => {
                this._appService.vaults$.next(res)
                this.toggleDeletingDialog(null)
            })
    }

    toggleEditDialog(vault): void {
        this.isUpdatingDialogOpened = !this.isUpdatingDialogOpened
        this.vault = vault
    }

    toggleDeletingDialog(vault): void {
        this.isDeletingDialogOpened = !this.isDeletingDialogOpened
        this.vault = vault
    }
}
