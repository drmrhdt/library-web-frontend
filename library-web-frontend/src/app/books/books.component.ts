import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'

import { mergeMap } from 'rxjs/operators'

import * as XLSX from 'xlsx'

import { AppService } from '../services/app.service'
import { BookService, VaultService } from '../api/index'

@Component({
    selector: 'app-books',
    templateUrl: './books.component.html',
    styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
    books$
    book
    isDeletingDialogOpened = false
    isUpdatingDialogOpened = false
    isExcelFile = false

    @ViewChild('inputFile') inputFile: ElementRef

    constructor(
        private _appService: AppService,
        private _bookService: BookService,
        private _vaultService: VaultService
    ) {}

    ngOnInit(): void {
        this.books$ = this._appService.books$
    }

    deleteBook(): void {
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
                this.toggleDeletingDialog(null)
            })
    }

    toggleEditDialog(book): void {
        this.isUpdatingDialogOpened = !this.isUpdatingDialogOpened
        this.book = book
    }

    toggleDeletingDialog(book): void {
        this.isDeletingDialogOpened = !this.isDeletingDialogOpened
        this.book = book
    }

    private importBooksToDB(books): void {
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

    onChange(event): void {
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

            this.importBooksToDB(data)
        }
    }
}
