import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

@Component({
    selector: 'app-vault-form',
    templateUrl: './vault-form.component.html',
    styleUrls: ['./vault-form.component.scss']
})
export class VaultFormComponent implements OnInit {
    vaultForm: FormGroup

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
}
