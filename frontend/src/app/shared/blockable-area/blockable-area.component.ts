import { Component, ElementRef, Input } from '@angular/core';

import { BlockableUI } from 'primeng/api';

@Component({
  selector: 'blockable-area',
  templateUrl: './blockable-area.component.html',
  styleUrls: ['./blockable-area.component.scss']
})
export class BlockableAreaComponent implements BlockableUI {
  @Input() style: any;
  @Input() class: any;

  constructor(private el: ElementRef) {}

  getBlockableElement(): HTMLElement {
    return this.el.nativeElement.children[0].children[1];
  }
}
