import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { AppService } from '../../services/app.service'

@Component({
    selector: 'app-vault-details',
    templateUrl: './vault-details.component.html',
    styleUrls: ['./vault-details.component.scss']
})
export class VaultDetailsComponent implements OnInit {
    vault

    private _unsubscriber$ = new Subject()

    constructor(
        private _route: ActivatedRoute,
        private _appService: AppService
    ) {}

    ngOnInit(): void {
        this._appService.vaults$
            .pipe(takeUntil(this._unsubscriber$))
            .subscribe(vaults =>
                this._route.params
                    .pipe(takeUntil(this._unsubscriber$))
                    .subscribe(params => {
                        this.vault = vaults?.find(
                            vault => vault.id === +params.id
                        )
                    })
            )
    }
}
