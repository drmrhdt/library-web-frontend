import { Component, OnInit } from '@angular/core'

import { AppService } from '../services/app.service'
import { BookService } from '../api/api/book.service'
import { mergeMap } from 'rxjs/operators'
import { VaultService } from '../api/api/vault.service'

@Component({
    selector: 'app-books',
    templateUrl: './books.component.html',
    styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
    books$
    book

    constructor(
        private _appService: AppService,
        private _bookService: BookService,
        private _vaultService: VaultService
    ) {}

    ngOnInit(): void {
        this.books$ = this._appService.books$
    }

    deleteBook(id: number): void {
        this._bookService
            .bookControllerDeleteById(id)
            .pipe(
                mergeMap(() => this._bookService.bookControllerGetAll()),
                mergeMap(res => {
                    this._appService.books$.next(res)
                    return this._vaultService.vaultControllerGetAll()
                })
            )
            .subscribe(res => this._appService.vaults$.next(res))
    }

    openEditDialog(book): void {
        this.book = book
    }
}
