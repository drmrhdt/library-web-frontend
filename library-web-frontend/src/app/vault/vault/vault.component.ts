import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'

import { filter, map, mergeMap } from 'rxjs/operators'

import { AppService } from '../../services/app.service'

@Component({
    selector: 'app-vault',
    templateUrl: './vault.component.html',
    styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements OnInit {
    vaults = []
    filteredVaults = []

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _appService: AppService
    ) {}

    ngOnInit(): void {
        this._appService.vaults$.subscribe(vaults => {
            this.vaults = vaults
            this.filteredVaults = vaults

            const id = +this._route.snapshot.firstChild?.params.id
            this.filteredVaults = id
                ? this.vaults?.filter(vault => vault.id === id)
                : this.vaults
        })

        this._router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                map(() => this._route),
                map(route => {
                    while (route.firstChild) route = route.firstChild
                    return route
                }),
                filter(route => route.outlet === 'primary'),
                mergeMap(route => route.params)
            )
            .subscribe(params => {
                const id = +params['id']
                this.filteredVaults = id
                    ? this.vaults?.filter(vault => vault.id === id)
                    : this.vaults
            })
    }
}
