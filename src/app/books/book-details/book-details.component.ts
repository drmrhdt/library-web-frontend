import {
    AfterContentChecked,
    AfterViewInit,
    Component,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

import { AppService } from '../../services/app.service'

@Component({
    selector: 'app-book-details',
    templateUrl: './book-details.component.html',
    styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit, OnDestroy {
    book

    private _unsubscriber$ = new Subject()

    constructor(
        private _route: ActivatedRoute,
        private _appService: AppService
    ) {}

    ngOnInit(): void {
        this._appService.books$
            .pipe(takeUntil(this._unsubscriber$))
            .subscribe(books => {
                this.book = books.find(
                    book => book.id === +this._route.snapshot.params.id
                )
            })
    }

    ngOnDestroy(): void {
        this._unsubscriber$.next()
        this._unsubscriber$.complete()
    }
}
