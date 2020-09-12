import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SideMenuComponent } from './side-menu/side-menu/side-menu.component';

const routes: Routes = [
  {
    path: 'vault',
    loadChildren: () =>
      import('./vault/vault.module').then((m) => m.VaultModule),
  },
  {
    path: 'books',
    component: SideMenuComponent,
    children: [{ path: ':id', component: SideMenuComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
