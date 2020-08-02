import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'lib-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {
  public visible: boolean = true;
  private visibleTimeout: number = 0;

  constructor() {
  }

  ngOnInit(): void {
  }

  @HostListener('document:mouseenter')
  showControls(): void {
    this.visible = true;
    clearTimeout(this.visibleTimeout);
  }

  @HostListener('document:mouseleave')
  hideControls(): void {
    this.visibleTimeout = setTimeout(() => this.visible = false, 50000000);
  }

}
