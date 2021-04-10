import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

import { Subject } from 'rxjs'
import { mergeMap, takeUntil } from 'rxjs/operators'

import { VaultService, BookService, CreateVaultDto } from '../api/index'

import { AppService } from '../services/app.service'

@Component({
    selector: 'app-vault-form',
    templateUrl: './vault-form.component.html',
    styleUrls: ['./vault-form.component.scss']
})
export class VaultFormComponent implements OnInit, OnDestroy {
    vaultForm: FormGroup

    @Output() success: EventEmitter<boolean> = new EventEmitter()

    @Input() vault

    private _unsubscriber$ = new Subject()

    constructor(
        private _formBuilder: FormBuilder,
        private _appService: AppService,
        private _bookService: BookService,
        private _vaultService: VaultService
    ) {}

    ngOnInit(): void {
        this.vaultForm = this._formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            description: ['', Validators.minLength(2)],
            numShelfs: [1, [Validators.required, Validators.min(1)]],
            numRows: [1, [Validators.required, Validators.min(1)]],
            maxBooksOnShelf: [1, [Validators.required, Validators.min(1)]]
            // listOfBooks
        })

        if (this.vault) {
            this.vaultForm.patchValue(this.vault)
        }
    }

    ngOnDestroy(): void {
        this._unsubscriber$.next()
        this._unsubscriber$.complete()
    }

    createVault(): void {
        if (this.vaultForm.invalid) {
            return
        }

        const vaultData: CreateVaultDto = this.vaultForm.value
        this._vaultService
            .vaultControllerCreate(vaultData)
            .pipe(
                takeUntil(this._unsubscriber$),
                mergeMap(() => this._vaultService.vaultControllerGetAll()),
                mergeMap(res => {
                    this._appService.vaults$.next(res)
                    return this._bookService.bookControllerGetAll()
                })
            )
            .subscribe(res => {
                this._appService.books$.next(res)
                this._resetForm()
                this.success.emit(true)
            })
    }

    updateVaultById(vault, id: number) {
        this._vaultService
            .vaultControllerUpdate(vault, id)
            .pipe(
                takeUntil(this._unsubscriber$),
                mergeMap(() => this._vaultService.vaultControllerGetAll()),
                mergeMap(res => {
                    this._appService.vaults$.next(res)
                    return this._bookService.bookControllerGetAll()
                })
            )
            .subscribe(() => {
                this.success.emit()
            })
    }

    private _resetForm() {
        this.vaultForm.reset({
            name: '',
            description: '',
            numShelfs: null,
            numRows: null,
            maxBooksOnShelf: null
        })
    }
}
