import { Component, OnInit } from '@angular/core'

import { menu } from '../side-menu/mocks/menu'
import { vaults } from '../../assets/mock/vaults'

@Component({
    selector: 'app-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
    menu = menu
    vaults = vaults
    isShowModalDialog = false
    isCreatingVault = false
    isCreatingBook = false

    constructor() {}

    ngOnInit(): void {}

    toggleModal(type?: string): void {
        this.isShowModalDialog = !this.isShowModalDialog
        if (type === 'vault') {
            this.isCreatingVault = !this.isCreatingVault
        } else if (type === 'book') {
            this.isCreatingBook = !this.isCreatingBook
        }
    }
}
