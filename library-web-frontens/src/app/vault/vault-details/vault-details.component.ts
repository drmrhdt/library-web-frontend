import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { vaults } from '../mocks/vaults';

@Component({
  selector: 'app-vault-details',
  templateUrl: './vault-details.component.html',
  styleUrls: ['./vault-details.component.scss'],
})
export class VaultDetailsComponent implements OnInit {
  vault;

  constructor(private _route: ActivatedRoute) {}

  ngOnInit(): void {
    this._route.params.subscribe(
      (params) => (this.vault = vaults.find((vault) => vault.id === params.id))
    );
  }
}
