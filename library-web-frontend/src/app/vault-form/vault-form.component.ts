import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

import { VaultService } from '../api/index'
import { CreateVaultDto } from '../api/model/createVaultDto'

@Component({
    selector: 'app-vault-form',
    templateUrl: './vault-form.component.html',
    styleUrls: ['./vault-form.component.scss']
})
export class VaultFormComponent implements OnInit {
    vaultForm: FormGroup

    constructor(
        private _formBuilder: FormBuilder,
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
    }

    addVault(): void {
        if (this.vaultForm.invalid) {
            return
        }

        const vaultData: CreateVaultDto = this.vaultForm.value
        this._vaultService.vaultControllerCreate(vaultData).subscribe(res => {
            this._resetForm()
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
