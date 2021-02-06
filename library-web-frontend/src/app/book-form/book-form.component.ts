import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { AngularFireStorage } from '@angular/fire/storage'

import { Observable, Subject } from 'rxjs'
import { finalize, mergeMap, takeUntil } from 'rxjs/operators'

import { VaultService, BookService, TagsService } from '../api/index'

import { AppService } from '../services/app.service'

import { getArrayFromNumber } from 'src/app/util/util'

@Component({
    selector: 'app-book-form',
    templateUrl: './book-form.component.html',
    styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit, OnDestroy {
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

    selectedImage: File = null
    downloadURL: Observable<string>
    previewBook = null

    private _unsubscriber$ = new Subject()

    constructor(
        private _formBuilder: FormBuilder,
        private _appService: AppService,
        private _bookService: BookService,
        private _vaultService: VaultService,
        private _tagService: TagsService,
        private _storage: AngularFireStorage
    ) {}

    ngOnInit(): void {
        this._appService.vaults$
            .pipe(takeUntil(this._unsubscriber$))
            .subscribe(vaults => (this.vaults = vaults))

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

    ngOnDestroy(): void {
        this._unsubscriber$.next()
        this._unsubscriber$.complete()
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
        this._tagService
            .tagsControllerFindAll()
            .pipe(takeUntil(this._unsubscriber$))
            .subscribe(tags => {
                this.tags = tags
                this._appService.tags$.next(tags)
            })
    }

    private _setVault(): void {
        this.bookForm
            .get('vault')
            .valueChanges.pipe(takeUntil(this._unsubscriber$))
            .subscribe(id => {
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
            .valueChanges.pipe(takeUntil(this._unsubscriber$))
            .subscribe(
                status =>
                    (this.isShowReasonOfMissingField = status === 'missing')
            )
    }

    createTag(tag): void {
        this._tagService
            .tagsControllerCreate({ name: tag })
            .pipe(takeUntil(this._unsubscriber$))
            .subscribe(() => {
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

    onDeletePhoto(input: HTMLInputElement): void {
        input.value = null
        this.previewBook = null
    }

    onImageSelected(event, userPhoto: HTMLInputElement): void {
        if (this.previewBook) {
            userPhoto.value = null
        }
        const file = event.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = _event => (this.previewBook = reader.result)
    }

    createBook(input: HTMLInputElement): void {
        if (this.bookForm.invalid) {
            return
        }

        this.saveImageAndUpdateBookWithPhoto(
            input,
            this.bookForm.value,
            null,
            'create'
        )
    }

    createOrUpdateBook(
        book,
        bookId,
        action: 'create' | 'update'
    ): Observable<any> {
        return action === 'create'
            ? this._bookService.bookControllerCreate(book)
            : this._bookService.bookControllerUpdate(book, bookId)
    }

    saveImageAndUpdateBookWithPhoto(
        input: HTMLInputElement,
        book,
        bookId,
        action: 'create' | 'update'
    ): void {
        const n = Date.now()
        const file = input.files[0]
        const filePath = `booksImages/${n}`
        const fileRef = this._storage.ref(filePath)
        const task = this._storage.upload(`booksImages/${n}`, file)

        task.snapshotChanges()
            .pipe(
                takeUntil(this._unsubscriber$),
                finalize(() =>
                    fileRef
                        .getDownloadURL()
                        .pipe(takeUntil(this._unsubscriber$))
                        .subscribe(url => {
                            if (!url) {
                                return
                            }

                            this.createOrUpdateBook(
                                action === 'update'
                                    ? { ...book, url }
                                    : [{ url, ...book }],
                                bookId,
                                action
                            )
                                .pipe(
                                    takeUntil(this._unsubscriber$),
                                    mergeMap(() =>
                                        this._bookService.bookControllerGetAll()
                                    ),
                                    mergeMap(res => {
                                        this._appService.books$.next(res)
                                        return this._vaultService.vaultControllerGetAll()
                                    })
                                )
                                .subscribe(res => {
                                    input.value = null
                                    this._appService.vaults$.next(res)
                                    this._resetForm()
                                    this.success.emit(true)
                                })
                        })
                )
            )
            .subscribe()
    }

    updateBook(book, input: HTMLInputElement): void {
        if (this.previewBook) {
            if (book.url) {
                this._storage
                    .refFromURL(book.url)
                    .delete()
                    .pipe(takeUntil(this._unsubscriber$))
                    .subscribe(() =>
                        this.saveImageAndUpdateBookWithPhoto(
                            input,
                            book,
                            book.id,
                            'update'
                        )
                    )
            } else {
                this.saveImageAndUpdateBookWithPhoto(
                    input,
                    book,
                    book.id,
                    'update'
                )
            }
        } else {
            this._bookService
                .bookControllerUpdate(
                    { url: this.book.url, ...this.bookForm.value },
                    book.id
                )
                .pipe(
                    takeUntil(this._unsubscriber$),
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
    }
}
