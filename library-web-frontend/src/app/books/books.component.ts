import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'

import { mergeMap } from 'rxjs/operators'

import * as XLSX from 'xlsx'

import { AppService } from '../services/app.service'
import { BookService, VaultService } from '../api/index'

import { getArrayFromNumber } from '../util/util'

enum PaginationArrowsActions {
    DEC = 'dec',
    INC = 'inc'
}

@Component({
    selector: 'app-books',
    templateUrl: './books.component.html',
    styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
    book
    books = []
    bookOnCurrentPage = []

    isDeletingDialogOpened = false
    isUpdatingDialogOpened = false
    isExcelFile = false

    BOOKS_PER_PAGE = 10
    DEFAULT_START_PAGE = 1
    VISIBLE_PAGES = 5

    currentPage = new FormControl(this.DEFAULT_START_PAGE)
    arrayOfPages: number[] = []

    PaginationArrowsActions = PaginationArrowsActions

    @ViewChild('inputFile') inputFile: ElementRef

    constructor(
        private _appService: AppService,
        private _bookService: BookService,
        private _vaultService: VaultService
    ) {}

    ngOnInit(): void {
        this._appService.books$.subscribe(books => {
            this._setSortBooksAlphabeticallyByNames(books)
            this._setPagination()
            this._setPaginatedBooks()
        })

        this.currentPage.valueChanges.subscribe((page: number) =>
            this._updateBooksByPage(page)
        )
    }

    private _setSortBooksAlphabeticallyByNames(books) {
        this.books = books.sort((fBook, sBook) =>
            fBook.name.localeCompare(sBook.name)
        )
    }

    private _setPagination(): void {
        const numberOfPages = Math.floor(
            this.books.length / this.BOOKS_PER_PAGE
        )
        this.arrayOfPages = getArrayFromNumber(numberOfPages, true, true)
    }

    private _setPaginatedBooks(): void {
        this.bookOnCurrentPage = this.books.slice(1, this.BOOKS_PER_PAGE)
    }

    onChangeCurrentPage(page?: number, action?: PaginationArrowsActions): void {
        if (page) {
            this.currentPage.patchValue(page)
        } else {
            this.currentPage.patchValue(
                action === PaginationArrowsActions.INC
                    ? this.currentPage.value + 1
                    : this.currentPage.value - 1
            )
        }
    }

    private _updateBooksByPage(page: number): void {
        this.bookOnCurrentPage =
            page === 0
                ? this.books.slice(0, this.BOOKS_PER_PAGE)
                : this.books.slice(
                      page * this.BOOKS_PER_PAGE,
                      page * this.BOOKS_PER_PAGE + this.BOOKS_PER_PAGE
                  )
    }

    onDeleteBook(): void {
        this._bookService
            .bookControllerDeleteById(this.book?.id)
            .pipe(
                mergeMap(() => this._bookService.bookControllerGetAll()),
                mergeMap(res => {
                    this._appService.books$.next(res)
                    return this._vaultService.vaultControllerGetAll()
                })
            )
            .subscribe(res => {
                this._appService.vaults$.next(res)
                this.onToggleDeletingDialog(null)
            })
    }

    onToggleEditDialog(book): void {
        this.isUpdatingDialogOpened = !this.isUpdatingDialogOpened
        this.book = book
    }

    onToggleDeletingDialog(book): void {
        this.isDeletingDialogOpened = !this.isDeletingDialogOpened
        this.book = book
    }

    private _importBooksToDB(books): void {
        this._bookService
            .bookControllerCreate(books)
            .pipe(
                mergeMap(() => this._bookService.bookControllerGetAll()),
                mergeMap(res => {
                    this._appService.books$.next(res)
                    return this._vaultService.vaultControllerGetAll()
                })
            )
            .subscribe(res => this._appService.vaults$.next(res))
    }

    onChangeImportFile(event): void {
        let data
        const target: DataTransfer = <DataTransfer>event.target
        this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/)
        if (target.files.length > 1) {
            this.inputFile.nativeElement.value = ''
        }
        if (!this.isExcelFile) {
            this.inputFile.nativeElement.value = ''
            return
        }
        //   this.spinnerEnabled = true;
        const reader: FileReader = new FileReader()
        reader.onload = (e: any) => {
            /* read workbook */
            const bstr: string = e.target.result
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' })

            /* grab first sheet */
            const wsname: string = wb.SheetNames[0]
            const ws: XLSX.WorkSheet = wb.Sheets[wsname]

            /* save data */
            data = XLSX.utils.sheet_to_json(ws)
        }

        reader.readAsBinaryString(target.files[0])

        reader.onloadend = e => {
            // this.spinnerEnabled = false;

            data.forEach(book => {
                const tags = book.tags.split(',')
                const tagObjects = []
                tags.forEach(bookTag => {
                    const tagObject = this._appService.tags$.value.find(
                        tag => tag.name === bookTag
                    )
                    if (tagObject) {
                        tagObjects.push(tagObject)
                    }
                })
                book.tags = tagObjects
            })

            this._importBooksToDB(data)
        }
    }
}
