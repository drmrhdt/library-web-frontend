import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'

import { Subject } from 'rxjs'
import { mergeMap, pairwise, takeUntil } from 'rxjs/operators'

import * as XLSX from 'xlsx'

import { AppService } from '../services/app.service'

import { BookService, VaultService } from '../api/index'

import { getArrayFromNumber } from '../util/util'

enum PaginationArrowsActions {
    DEC = 'dec',
    INC = 'inc'
}

enum SortActions {
    ASC = 'asc',
    DESC = 'desc'
}

@Component({
    selector: 'app-books',
    templateUrl: './books.component.html',
    styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit, OnDestroy {
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
    VISIBLE_PAGES = 10

    ALL = 'all'

    currentPage = new FormControl(this.DEFAULT_START_PAGE)
    pages: number[] = []
    visiblePages: number[] = []

    filtersForm: FormGroup

    PaginationArrowsActions = PaginationArrowsActions
    SortActions = SortActions

    @ViewChild('inputFile') inputFile: ElementRef

    private _unsubscriber$ = new Subject()

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
            tags: [this.ALL],
            sortByName: [{ isApplied: true, action: SortActions.ASC }],
            sortByAuthor: [{ isApplied: false, action: null }]
        })

        this._appService.vaults$
            .pipe(takeUntil(this._unsubscriber$))
            .subscribe(vaults => (this.vaults = vaults))

        this.filtersForm.valueChanges
            .pipe(takeUntil(this._unsubscriber$))
            .subscribe(filters => {
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

                const sortByNameControl = this.filtersForm.get('sortByName')
                const sortByAuthorControl = this.filtersForm.get('sortByAuthor')

                if (sortByNameControl.value.isApplied) {
                    this._setSortBooksAlphabetically(
                        this.filteredBooks,
                        'name',
                        sortByNameControl.value.action === SortActions.ASC
                            ? SortActions.ASC
                            : SortActions.DESC
                    )
                }

                if (sortByAuthorControl.value.isApplied) {
                    this._setSortBooksAlphabetically(
                        this.filteredBooks,
                        'author',
                        sortByAuthorControl.value.action === SortActions.ASC
                            ? SortActions.ASC
                            : SortActions.DESC
                    )
                }

                this._setPagination()
                this._setPaginatedBooks()
            })

        this._appService.tags$
            .pipe(takeUntil(this._unsubscriber$))
            .subscribe(tags => (this.tags = tags))

        this._appService.books$
            .pipe(takeUntil(this._unsubscriber$))
            .subscribe(books => {
                this.books = books
                this.filteredBooks = this.books
                this._setSortBooksAlphabetically(
                    this.filteredBooks,
                    'name',
                    SortActions.ASC
                )
                this._setPagination()
                this._setPaginatedBooks()
            })

        this.currentPage.valueChanges
            .pipe(pairwise())
            .pipe(takeUntil(this._unsubscriber$))
            .subscribe(([prevPage, nextPage]) => {
                this._updateVisiblePages(nextPage)
                this._updateBooksByPage(prevPage, nextPage)
            })
    }

    ngOnDestroy(): void {
        this._unsubscriber$.next()
        this._unsubscriber$.complete()
    }

    private _setSortBooksAlphabetically(
        books,
        sortParam: string,
        order: SortActions
    ): void {
        if (order === SortActions.ASC) {
            this.filteredBooks = books.sort((fBook, sBook) =>
                fBook.name.localeCompare(sBook[sortParam])
            )
        } else if (order === SortActions.DESC) {
            this.filteredBooks = books.sort((fBook, sBook) =>
                sBook.name.localeCompare(fBook[sortParam])
            )
        }
    }

    private _setPagination(): void {
        const numberOfPages = Math.floor(
            this.filteredBooks.length / this.BOOKS_PER_PAGE
        )
        this.pages = getArrayFromNumber(numberOfPages, true, true)
        this.currentPage.patchValue(this.pages[0])
        this._updateVisiblePages(this.DEFAULT_START_PAGE)
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

    private _updateVisiblePages(currentPage: number): void {
        const leftBorder =
            Math.floor((currentPage - 1) / this.VISIBLE_PAGES) *
            this.VISIBLE_PAGES
        const rightBorder = leftBorder + this.VISIBLE_PAGES

        this.visiblePages = this.pages.slice(leftBorder, rightBorder)
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
            .pipe(takeUntil(this._unsubscriber$))
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
            .pipe(takeUntil(this._unsubscriber$))
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
