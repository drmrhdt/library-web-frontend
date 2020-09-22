import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'

import { filter, map, mergeMap } from 'rxjs/operators'

import { vaults } from '../../../assets/mock/vaults'

@Component({
    selector: 'app-vault',
    templateUrl: './vault.component.html',
    styleUrls: ['./vault.component.scss']
})
export class VaultComponent implements OnInit {
    vaults = vaults
    filteredVaults = vaults

    constructor(private _route: ActivatedRoute, private _router: Router) {}

    ngOnInit(): void {
        this.filterVaults()
    }

    filterVaults(): void {
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
                this.filteredVaults = params.id
                    ? this.vaults.filter(vault => vault.id === params.id)
                    : this.vaults
            })

        const id = this._route.snapshot.firstChild?.params.id
        this.filteredVaults = id
            ? this.vaults.filter(vault => vault.id === id)
            : this.vaults
    }
}
