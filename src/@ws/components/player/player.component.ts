import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnInit,
  Input,
} from '@angular/core';

@Component({
  selector: 'ws-player',
  templateUrl: './player.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WsPlayerComponent implements OnInit {
  // 播放路径
  @Input() src: string;

  // 自动播放
  @Input() autoplay: boolean = true;

  // 循环播放
  @Input() loop: boolean = true;

  // 播放模式
  @Input() mode: 'normal' | 'bounce' = 'normal';

  // 播放速度
  @Input() speed: number = 1;

  // 背景颜色
  @Input() background: string = 'transparent';

  // 宽度
  @Input() width: any = '100%';

  constructor() {}

  ngOnInit(): void {}
}
