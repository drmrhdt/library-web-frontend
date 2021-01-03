import { Component, OnInit } from '@angular/core'

import { AppService } from '../services/app.service'

@Component({
    selector: 'app-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
    menu = [
        {
            name: 'Книги',
            route: 'books',
            items: [
                {
                    name: 'Нерассортированные',
                    route: 'withoutVault'
                },
                { name: 'Отсутствующие', route: 'missing' }
            ]
        }
    ]
    vaults
    isShowModalDialog = false
    isCreatingVault = false
    isCreatingBook = false

    constructor(private _appService: AppService) {}

    ngOnInit(): void {
        this._appService.vaults$.subscribe(vaults => {
            this.vaults = vaults

            if (this.vaults?.length) {
                const vaultsMenu = {
                    name: 'Хранилища',
                    route: 'vault',
                    items: this.vaults?.map(vault => ({
                        name: vault.name,
                        route: vault.id
                    }))
                }

                this.menu.unshift(vaultsMenu)
            }
        })
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
