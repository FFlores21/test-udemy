import { Component } from '@angular/core';
import { InputNumber } from 'primeng/inputnumber';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  templateUrl: './verification.component.html',
})
export class VerificationComponent {
  val1!: number;

  val2!: number;

  val3!: number;

  val4!: number;

  constructor(private layoutService: LayoutService) {}

  get dark(): boolean {
    return this.layoutService.config.colorScheme !== 'light';
  }

  focusOnNext(inputEl: InputNumber) {
    inputEl.input.nativeElement.focus();
  }
}
