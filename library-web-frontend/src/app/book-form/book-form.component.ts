import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { getArrayFromNumber } from 'src/app/util/util'

import { AppService } from '../services/app.service'

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

    @Output() success: EventEmitter<boolean> = new EventEmitter()

    statuses = [
        { text: 'Отсутствует', value: 'missing' },
        { text: 'На месте', value: 'inPlace' }
    ]

    constructor(
        private _formBuilder: FormBuilder,
        private _appService: AppService
    ) {}

    ngOnInit(): void {
        this._appService.vaults$.subscribe(vaults => (this.vaults = vaults))

        this.bookForm = this._formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            author: ['', [Validators.required, Validators.minLength(2)]],
            description: ['', Validators.minLength(2)],
            vault: [null],
            shelf: [null],
            row: [null],
            number: [null],
            status: ['inPlace'],
            reasonOfmissing: ['']
        })

        this._setVaultData()
        this._showReasonFieldDependsOnStatus()
    }

    private _setVaultData(): void {
        this.bookForm.get('vault').valueChanges.subscribe(id => {
            this.currentVault = this.vaults.find(vault => vault.id === id)
            if (this.currentVault) {
                this.bookForm
                    .get('shelf')
                    .patchValue(this.currentVault.shelfs.shelfs[0].number)

                this.bookForm
                    .get('row')
                    .patchValue(
                        this.currentVault.shelfs.shelfs[0].rows[0].number
                    )

                this.isShowVaultsFields = true
                this.maxBooksOnShelfArray = getArrayFromNumber(
                    this.currentVault.maxBooksOnShelf
                )

                this.bookForm
                    .get('number')
                    .patchValue(this.maxBooksOnShelfArray[0] + 1)
            }
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

    addBook(): void {
        if (this.bookForm.valid) {
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

            this.success.emit(true)
        }
    }
}
