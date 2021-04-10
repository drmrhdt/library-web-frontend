import {
    Component,
    Output,
    Input,
    TemplateRef,
    EventEmitter
} from '@angular/core'

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
    @Input() isShowCloseBtn = true
    @Input() isShowConfirmBtn = false
    @Input() modalTitle = ''
    @Input() confirmText = ''
    @Input() bodyComponent: TemplateRef<any>

    @Output() close: EventEmitter<null> = new EventEmitter<null>()
    @Output() confirm: EventEmitter<null> = new EventEmitter<null>()

    closeDialog(): void {
        this.close.emit()
    }

    onConfirmClick(): void {
        this.confirm.emit()
    }
}
