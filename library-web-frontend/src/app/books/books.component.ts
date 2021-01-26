import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'

import { mergeMap, pairwise } from 'rxjs/operators'

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
    filteredBooks = []
    booksOnCurrentPage = []
    tags = []
    vaults = []

    isDeletingDialogOpened = false
    isUpdatingDialogOpened = false
    isExcelFile = false

    BOOKS_PER_PAGE = 10
    DEFAULT_START_PAGE = 1
    VISIBLE_PAGES = 5

    ALL = 'all'

    currentPage = new FormControl(this.DEFAULT_START_PAGE)
    pages: number[] = []

    filtersForm: FormGroup

    PaginationArrowsActions = PaginationArrowsActions

    @ViewChild('inputFile') inputFile: ElementRef

    constructor(
        private _formBuilder: FormBuilder,
        private _appService: AppService,
        private _bookService: BookService,
        private _vaultService: VaultService
    ) {}

    ngOnInit(): void {
        this.filtersForm = this._formBuilder.group({
            status: [this.ALL],
            vault: [this.ALL],
            tags: [this.ALL]
        })

        this._appService.vaults$.subscribe(vaults => (this.vaults = vaults))

        this.filtersForm.valueChanges.subscribe(filters => {
            this.filteredBooks = this.books
                .filter(book =>
                    filters.status === this.ALL
                        ? book
                        : book.status === filters.status
                )
                .filter(book => {
                    if (filters.vault === this.ALL) {
                        return book
                    } else if (filters.vault === 'withoutVault') {
                        return !book.vault
                    } else if (filters.vault === 'withVault') {
                        return book.vault
                    } else if (typeof +filters.vault === 'number') {
                        return book?.vault?.id === +filters.vault
                    }
                })
                .filter(book =>
                    filters.tags === this.ALL
                        ? book
                        : book.tags.find(tag => filters.tags === tag.name)
                )

            this._setSortBooksAlphabeticallyByNames(this.filteredBooks)
            this._setPagination()
            this._setPaginatedBooks()
        })

        this._appService.tags$.subscribe(tags => (this.tags = tags))

        this._appService.books$.subscribe(books => {
            this.books = books
            this.filteredBooks = this.books
            this._setSortBooksAlphabeticallyByNames(this.filteredBooks)
            this._setPagination()
            this._setPaginatedBooks()
        })

        this.currentPage.valueChanges
            .pipe(pairwise())
            .subscribe(([prevPage, nextPage]) =>
                this._updateBooksByPage(prevPage, nextPage)
            )
    }

    private _setSortBooksAlphabeticallyByNames(books): void {
        this.filteredBooks = books.sort((fBook, sBook) =>
            fBook.name.localeCompare(sBook.name)
        )
    }

    private _setPagination(): void {
        const numberOfPages = Math.ceil(
            this.filteredBooks.length / this.BOOKS_PER_PAGE
        )
        this.pages = getArrayFromNumber(numberOfPages, true, true)
        this.currentPage.patchValue(this.pages[0])
    }

    private _setPaginatedBooks(): void {
        this.booksOnCurrentPage = this.filteredBooks.slice(
            0,
            this.BOOKS_PER_PAGE
        )
    }

    onChangeCurrentPage(page?: number, action?: PaginationArrowsActions): void {
        if (page === this.currentPage.value) {
            return
        }
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

    private _updateBooksByPage(prevPage: number, nextPage: number): void {
        this.booksOnCurrentPage =
            nextPage === this.DEFAULT_START_PAGE
                ? this.filteredBooks.slice(0, this.BOOKS_PER_PAGE)
                : this.filteredBooks.slice(
                      prevPage * this.BOOKS_PER_PAGE,
                      prevPage * this.BOOKS_PER_PAGE + this.BOOKS_PER_PAGE
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

    onExportBooks(link: HTMLLinkElement): void {
        const file = []
        this.books.forEach(book => {
            const row = {
                Название: book?.name,
                Автор: book?.author,
                Описание: book?.description,
                Хранилище: book?.vault?.name,
                Полка: book?.shelf,
                Ряд: book?.row,
                Номер: book?.number,
                Статус: book?.status,
                'Причина отсутствия': book?.reasonOfMissing,
                Тэги: this._generateTagsString(book?.tags)
            }
            file.push(row)
        })

        const wsFile = XLSX.utils.json_to_sheet(file)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, wsFile, 'List1')
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const blob = new Blob([wbout], { type: 'application/octet-stream' })

        const fileName = `exportedBooks.xlsx`

        this._download(link, blob, fileName)
    }

    private _generateTagsString(tags: { id: number; name: string }[]): string {
        let str = ''
        tags.forEach((tag, i) => {
            str = str + tag.name + (i === tags.length - 1 ? '' : ',')
            return str + tag.name + (i === tags.length - 1 ? '' : ',')
        })
        return str
    }

    private _download(link: HTMLLinkElement, blob: Blob, fileName: string) {
        link.setAttribute('download', fileName)
        link.setAttribute('href', window.URL.createObjectURL(blob))

        link.click()
    }
}
