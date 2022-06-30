import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { WsVerticalNavigationComponent } from '@ws/components/navigation/vertical/vertical.component';
import { WsNavigationService } from '@ws/components/navigation/navigation.service';
import { WsNavigationItem } from '@ws/components/navigation/navigation.types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'ws-vertical-navigation-divider-item',
  templateUrl: './divider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WsVerticalNavigationDividerItemComponent implements OnInit {
  @Input() item: WsNavigationItem;
  @Input() name: string;

  private _wsVerticalNavigationComponent: WsVerticalNavigationComponent;

  /**
   * 构造函数
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _wsNavigationService: WsNavigationService,
  ) {}

  // ----------------------------------------------------------------------------
  // @ 生命周期钩子
  // ----------------------------------------------------------------------------

  /**
   * 组件初始化
   */
  ngOnInit(): void {
    // 获取父导航组件
    this._wsVerticalNavigationComponent = this._wsNavigationService.getComponent(this.name);

    // 在导航组件上订阅onRefreshed
    this._wsVerticalNavigationComponent.onRefreshed
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        // 检测变更
        this._changeDetectorRef.markForCheck();
      });
  }
}
