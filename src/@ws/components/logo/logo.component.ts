import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ws-logo',
  templateUrl: './logo.component.html',
})
export class WsLogoComponent implements OnInit {
  // 图片路径
  @Input() src: string = 'assets/images/logo/logo.svg';
  // 图片名称
  @Input() alt: string = 'Logo图片';

  constructor() {}

  ngOnInit(): void {}
}
