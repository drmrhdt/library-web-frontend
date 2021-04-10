import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class AppService {
    vaults$ = new BehaviorSubject([])
    books$ = new BehaviorSubject([])
    tags$ = new BehaviorSubject([])
}
