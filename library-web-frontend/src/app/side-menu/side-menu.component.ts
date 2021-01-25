import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { AppService } from '../services/app.service'

@Component({
    selector: 'app-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
    menu = []
    bookMenu = {
        name: 'Книги',
        route: 'books'
    }
    vaults
    isShowModalDialog = false
    isCreatingVault = false
    isCreatingBook = false

    constructor(private _appService: AppService, private _router: Router) {}

    ngOnInit(): void {
        this._appService.vaults$.subscribe(vaults => {
            this.vaults = vaults

            this.menu = []

            const vaultsMenu = {
                name: 'Хранилища',
                route: 'vault',
                items: this.vaults?.map(vault => ({
                    name: vault.name,
                    route: vault.id
                }))
            }

            this.menu.unshift(vaultsMenu, this.bookMenu)
        })
    }

    isOuterMenuItemChecked(route): boolean {
        return this._router.url.includes(route)
    }

    isNestedMenuItemChecked(route): boolean {
        const parsedUrl = this._router.url.split('/')
        return parsedUrl[parsedUrl.length - 1] == route
    }

    toggleModal(type?: string): void {
        this.isShowModalDialog = !this.isShowModalDialog
        if (type === 'vault') {
            this.isCreatingVault = !this.isCreatingVault
        } else if (type === 'book') {
            this.isCreatingBook = !this.isCreatingBook
        }
    }
}
