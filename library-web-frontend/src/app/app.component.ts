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

        this._vaultService.vaultControllerGetAll().subscribe(vaults => {
            const unfilteredVaults = vaults
            const filteredVaults = []

            for (
                let curVaultNum = 0;
                curVaultNum < unfilteredVaults.length;
                curVaultNum++
            ) {
                const curVault = unfilteredVaults[curVaultNum]
                curVault.shelfs = []
                for (
                    let curShelf = 1;
                    curShelf <= curVault.numShelfs;
                    curShelf++
                ) {
                    const shelf = { rows: [] }
                    // filter books by shelfs
                    const booksOnCurShelf = curVault.books.filter(
                        book => book.shelf === curShelf
                    )
                    // filter books by rows on current shelf
                    for (let curRow = 1; curRow <= curVault.numRows; curRow++) {
                        const booksOnCurRow = booksOnCurShelf
                            .filter(book => book.row === curRow)
                            .sort(book => book.number) // sort by order on row
                        const row = { books: [] }
                        row.books.push(...booksOnCurRow)
                        shelf.rows.push(row)
                    }
                    curVault.shelfs.push(shelf)
                }
                filteredVaults.push(curVault)
            }

            this._appService.vaults$.next(filteredVaults)
        })
    }
}
