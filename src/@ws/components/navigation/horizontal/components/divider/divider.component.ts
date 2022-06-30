import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { WsHorizontalNavigationComponent } from '@ws/components/navigation/horizontal/horizontal.component';
import { WsNavigationService } from '@ws/components/navigation/navigation.service';
import { WsNavigationItem } from '@ws/components/navigation/navigation.types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'ws-horizontal-navigation-divider-item',
  templateUrl: './divider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WsHorizontalNavigationDividerItemComponent implements OnInit {
  @Input() item: WsNavigationItem;
  @Input() name: string;

  private _wsHorizontalNavigationComponent: WsHorizontalNavigationComponent;

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
    this._wsHorizontalNavigationComponent = this._wsNavigationService.getComponent(this.name);

    // 在导航组件上订阅onRefreshed
    this._wsHorizontalNavigationComponent.onRefreshed
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        // 检测变更
        this._changeDetectorRef.markForCheck();
      });
  }
}
