import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { WsLoadingService } from '@ws/services/loading';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'ws-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'wsLoadingBar',
})
export class WsLoadingBarComponent implements OnChanges, OnInit {
  // 打开或关闭自动模式
  @Input() autoMode: boolean = true;
  mode: 'determinate' | 'indeterminate';
  progress: number = 0;
  show: boolean = false;

  /**
   * 构造函数
   */
  constructor(private _wsLoadingService: WsLoadingService) {}

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 绑定输入改变
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    // 自动模式
    if ('autoMode' in changes) {
      // 在服务中设置自动模式
      this._wsLoadingService.setAutoMode(coerceBooleanProperty(changes.autoMode.currentValue));
    }
  }

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 订阅服务
    this._wsLoadingService.mode$
      .pipe(untilDestroyed(this))
      .subscribe(value => {
        this.mode = value;
      });

    this._wsLoadingService.progress$
      .pipe(untilDestroyed(this))
      .subscribe(value => {
        this.progress = value;
      });

    this._wsLoadingService.show$
      .pipe(untilDestroyed(this))
      .subscribe(value => {
        this.show = value;
      });
  }
}
