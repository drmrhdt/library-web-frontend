import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

import { menu } from '../side-menu/mocks/menu'
import { vaults } from '../../../assets/mock/vaults'

import { getArrayFromNumber } from '../../util/util'

@Component({
    selector: 'app-side-menu',
    templateUrl: './side-menu.component.html',
    styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
    menu = menu
    vaults = vaults
    isShowModalDialog = false
    isCreatingVault = false
    isCreatingBook = false
    vaultForm: FormGroup
    bookForm: FormGroup

    statuses = [
        { text: 'Отсутствует', value: 'missing' },
        { text: 'На месте', value: 'inPlace' }
    ]

    currentVault = null
    maxBooksOnShelfArray: Array<number>

    isShowVaultsFields = false
    isShowReasonOfMissingField = false

    constructor(private _formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.vaultForm = this._formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            description: ['', Validators.minLength(2)],
            numShelfs: [1, [Validators.required, Validators.min(1)]],
            numRows: [1, [Validators.required, Validators.min(1)]],
            maxBooksOnShelf: [1, [Validators.required, Validators.min(1)]]
            // listOfBooks
        })

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

        this.setBookLocationInVault()

        this.bookForm
            .get('status')
            .valueChanges.subscribe(
                status =>
                    (this.isShowReasonOfMissingField = status === 'missing')
            )
    }

    setBookLocationInVault(): void {
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

    toggleModal(type?: string): void {
        this.isShowModalDialog = !this.isShowModalDialog
        if (type === 'vault') {
            this.isCreatingVault = !this.isCreatingVault
        } else if (type === 'book') {
            this.isCreatingBook = !this.isCreatingBook
        }
    }

    addVault(): void {
        if (this.vaultForm.valid) {
            console.log(this.vaultForm.value)
            this.vaultForm.reset({
                name: '',
                description: '',
                numShelfs: null,
                numRows: null,
                maxBooksOnShelf: null
            })
        }
    }

    addBook(): void {
        if (this.bookForm.valid) {
            console.log(this.bookForm.value)
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
}
