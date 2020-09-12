import { Component } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent {
  menu = [
    {
      name: 'Хранилища',
      route: 'vault',
      items: [
        { name: 'Хранилище 1', route: '1' },
        { name: 'Хранилище 2', route: '2' },
        { name: 'Хранилище 3', route: '3' },
      ],
    },
    {
      name: 'Книги',
      route: 'books',
      items: [
        {
          name: 'Нерассортированные',
          route: 'noVault',
        },
        { name: 'Отсутствующие', route: 'noHere' },
      ],
    },
  ];
}
