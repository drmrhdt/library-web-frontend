import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'

import { mergeMap } from 'rxjs/operators'

import { VaultService, BookService, TagsService } from '../api/index'

import { AppService } from '../services/app.service'

import { getArrayFromNumber } from 'src/app/util/util'

@Component({
    selector: 'app-book-form',
    templateUrl: './book-form.component.html',
    styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit {
    bookForm: FormGroup
    isShowReasonOfMissingField = false
    isShowVaultsFields = false
    currentVault = null
    maxBooksOnShelfArray: Array<number>
    vaults

    inputTag = new FormControl()

    @Input() book

    @Output() success: EventEmitter<boolean> = new EventEmitter()

    statuses = [
        { text: 'Отсутствует', value: 'missing' },
        { text: 'На месте', value: 'inPlace' }
    ]

    tags: { id: number; name: string; value: string }[] = []

    constructor(
        private _formBuilder: FormBuilder,
        private _appService: AppService,
        private _bookService: BookService,
        private _vaultService: VaultService,
        private _tagService: TagsService
    ) {}

    ngOnInit(): void {
        this._appService.vaults$.subscribe(vaults => (this.vaults = vaults))

        this.bookForm = this._formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            author: ['', [Validators.required, Validators.minLength(2)]],
            description: ['', Validators.minLength(2)],
            vault: null,
            shelf: null,
            row: null,
            number: null,
            status: ['inPlace'],
            reasonOfMissing: [''],
            tags: []
        })

        this._setBook(this.book)
        this._setVault()
        this._setTags()
        this._showReasonFieldDependsOnStatus()
    }

    private _setBook(book): void {
        if (book) {
            this.bookForm.patchValue({
                ...this.book,
                vault: this.book?.vault?.id || null
            })
        }
    }

    private _setTags(): void {
        this._tagService.tagsControllerFindAll().subscribe(tags => {
            this.tags = tags
            this._appService.tags$.next(tags)
        })
    }

    private _setVault(): void {
        this.bookForm.get('vault').valueChanges.subscribe(id => {
            this.currentVault = this.vaults.find(vault => vault.id === +id)

            if (!this.currentVault) {
                return
            }

            this.bookForm.get('shelf').patchValue('1')
            this.bookForm.get('row').patchValue('1')

            this.isShowVaultsFields = true
            this.maxBooksOnShelfArray = getArrayFromNumber(
                this.currentVault.maxBooksOnShelf
            )

            this.bookForm
                .get('number')
                .patchValue(this.maxBooksOnShelfArray[0] + 1)
        })
    }

    private _showReasonFieldDependsOnStatus(): void {
        this.bookForm
            .get('status')
            .valueChanges.subscribe(
                status =>
                    (this.isShowReasonOfMissingField = status === 'missing')
            )
    }

    createBook(): void {
        if (this.bookForm.invalid) {
            return
        }
        const bookData = this.bookForm.value
        this._bookService
            .bookControllerCreate([bookData])
            .pipe(
                mergeMap(() => this._bookService.bookControllerGetAll()),
                mergeMap(res => {
                    this._appService.books$.next(res)
                    return this._vaultService.vaultControllerGetAll()
                })
            )
            .subscribe(res => {
                this._appService.vaults$.next(res)
                this._resetForm()
                this.success.emit(true)
            })
    }

    updateBook(book): void {
        this._bookService
            .bookControllerUpdate(this.bookForm.value, book.id)
            .pipe(
                mergeMap(() => this._bookService.bookControllerGetAll()),
                mergeMap(res => {
                    this._appService.books$.next(res)
                    return this._vaultService.vaultControllerGetAll()
                })
            )
            .subscribe(res => {
                this._appService.vaults$.next(res)
                this.success.emit(true)
            })
    }

    createTag(tag): void {
        this._tagService.tagsControllerCreate({ name: tag }).subscribe(() => {
            this._setTags()
            this.inputTag.patchValue('')
        })
    }

    private _resetForm(): void {
        this.bookForm.reset({
            name: '',
            author: '',
            description: '',
            vault: null,
            shelf: null,
            row: null,
            number: null,
            status: 'inPlace',
            reasonOfmissing: ''
        })
    }
}
