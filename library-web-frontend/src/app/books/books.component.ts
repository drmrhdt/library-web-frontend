import { Component, OnInit } from '@angular/core'

import { AppService } from '../services/app.service'

@Component({
    selector: 'app-books',
    templateUrl: './books.component.html',
    styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
    books$

    constructor(private _appService: AppService) {}

    ngOnInit(): void {
        this.books$ = this._appService.books$
    }
}
